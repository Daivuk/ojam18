// Globals
if (typeof global === 'undefined') {
    (function () {
        var global = new Function('return this;')();
        Object.defineProperty(global, 'global', {
            value: global,
            writable: true,
            enumerable: false,
            configurable: true
        });
    })();
}

var resolution = Renderer.getResolution(); // Cache this globally
var cameraX = 0;
var cameraTargetX = 0;
var transformWeather;
var transform; // global camera transform, in case we need it elsewhere
var invTrasform; // In case we need mouse picking shit
var transformUI;
var invTransformUI;
var resolutionUI;
var zoom = 16.0;
var zoomTarget = 8.0;
var zoomTargetOffset = 0;
var zoomFast = 0;
var wind = 0;
var uiFade = 0;

var master_volume = 0.5;

// Resources
var worldRT = Texture.createScreenRenderTarget();
var screenRT = Texture.createScreenRenderTarget();
var bloomRT = Texture.createRenderTarget(new Vector2(256, 256));
var worldShader = getShader("world.ps");
var bloomSelectShader = getShader("bloomSelect.ps");
var plantVSShader = getShader("plant.vs");
var whiteData = new Uint32Array(1);
whiteData[0] = 0xFFFFFFFF;
var whiteTexture = Texture.createFromData(whiteData, Vector2.ONE);
var font = getFont("font.fnt");
var boomSelect = 0.8;
var boomAmount = 1;
var distanceBetweenPlants = 30;

var music = getMusic("Fertile_Ground_Music_v0.1h.ogg");
music.setVolume(master_volume);
music.play(true);

// Init some crap
weather_init();

var ppp = null;
init_plants();

var saveLoadTypes = ["Day", "Focus", "FertileGround", "Month", "Plant", "Season", "Weather", "Resources", "Iceage"];

function save()
{
    var saveObject = new Object();
    saveLoadTypes.forEach(function(type) {
        // Generic Save from TypeDataSaveProperties
        var saveObjectForType = new Object();
        var currentData = global[type + "Data"];
        if (currentData !== undefined)
        {
            global[type + "DataSaveProperties"].forEach(function(saveProperty) {
                saveObjectForType[saveProperty] = currentData[saveProperty];
            });
            saveObject[type] = saveObjectForType;
        }

        // Custom Save
        var customSaveFunction = global[toUnderScoreFromPascalCase(type).toLowerCase() + "_save"];
        if (typeof customSaveFunction === "function")
        {
            customSaveFunction();
        }
    });

    var saveJSON = JSON.stringify(saveObject);
    new BinaryFileWriter("save.json").writeString(saveJSON);
}

function load()
{
    var file = new BinaryFileReader("save.json");
    var loadObject = JSON.parse(file.readString());
    saveLoadTypes.forEach(function(type) {
        // Generic Load
        var currentloadObject = loadObject[type];
        var currentData = global[type + "Data"];
        Object.getOwnPropertyNames(loadObject[type]).forEach(function (functionloadDataProperty) {
            currentData[functionloadDataProperty] = currentloadObject[functionloadDataProperty];
        });

        // Custom Load
        var customLoadFunction = global[toUnderScoreFromPascalCase(type).toLowerCase() + "_load"];
        if (typeof customLoadFunction === "function")
        {
            customLoadFunction(currentloadObject);
        }
    });
}
var zoomFadePercent = 0;
var zoomFadeDelay = 3;
var zoomFadeColor;

function animVol(val, target, dt)
{
    if (val < target) val = Math.min(target, val + dt);
    else if (val > target) val = Math.max(target, val - dt);
    return val;
}

function update(dt)
{
    if (Input.isJustDown(Key.ESCAPE)) quit();

    birdVol = animVol(birdVol, birdVolT, dt);
    cricketsVol = animVol(cricketsVol, cricketsVolT, dt);
    birdsSound.setVolume(birdVol * ambientVolume * master_volume);
    cricketsSound.setVolume(cricketsVol * ambientVolume * master_volume);

    resolution = Renderer.getResolution();
    if (MainMenuData.isDisplaying)
    {
        main_menu_update(dt);
    }
    if (!MainMenuData.isDisplaying || MainMenuData.isGameOver)
    {
        var paused = MainMenuData.isGameOver || showDebug;

        wind += dt;
        uiFade = Math.min(0, uiFade + dt);

        // Move camera...
        cameraTargetX = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData.position;
        cameraX = cameraX + (cameraTargetX - cameraX) * 3 * dt;

        // Update world matrix
        zoomTarget = Math.max(4.6, 8.6 - FocusData.focusItems.length * 0.2);
        var zoomSpeed = 1;
        if (zoomFast > 0)
        {
            zoomFast -= dt;
            zoomSpeed = 4;
        }
        zoom = zoom + ((zoomTarget + zoomTargetOffset) - zoom) * zoomSpeed * dt;
        var scale = zoom;

        zoomFadeDelay -= dt;
        if (zoomFadeDelay < 0) zoomFadePercent = Math.min(1, zoomFadePercent + dt);
        zoomFadeColor = new Color(zoomFadePercent);

        transformWeather = Matrix.IDENTITY;
        transformWeather = transformWeather.mul(Matrix.createTranslation(new Vector3(-cameraX, 0, 0)));
        transformWeather = transformWeather.mul(Matrix.createScale(8));
        transformWeather = transformWeather.mul(Matrix.createTranslation(new Vector3(resolution.x * 0.5, resolution.y * .8, 0)));

        transform = Matrix.IDENTITY;
        transform = transform.mul(Matrix.createTranslation(new Vector3(-cameraX, 0, 0)));
        transform = transform.mul(Matrix.createScale(scale));
        transform = transform.mul(Matrix.createTranslation(new Vector3(resolution.x * 0.5, resolution.y * .8, 0)));
        invTrasform = transform.invert();

        // Update UI matrix
        var uiscale = 180.0 / resolution.y;
        resolutionUI = new Vector2(resolution.x * uiscale, resolution.y * uiscale);
        transformUI = Matrix.createScale(1.0 / uiscale);
        invTransformUI = transformUI.invert();

        if (!paused)
            if (Input.isDown(Key.LEFT_CONTROL) && Input.isJustDown(Key.S))
            {
                save();
            }
            else if(Input.isDown(Key.LEFT_CONTROL) && Input.isJustDown(Key.L))
            {
                load();
            }

        fertile_ground_update();
        
        if (!fertile_ground_is_menu_open() && !paused)
        {
            focus_update(dt);
        }
        
        // hues, saturation and brightness
        updateHSV(dt);

        debug_update(dt); // Debug menu
        Input.setMouseVisible(showDebug)
        if (!showDebug)
        {
            resources_update(dt);
            day_update(dt);
            plants_update(dt);
            iceage_update(dt);

            // plant_update can trigger game over
            if (MainMenuData.isDisplaying)
            {
                return;
            }
        }
        weather_updateActive(dt);
        butterfly_update(dt);
    }
}

function postProcess()
{
    var screenRect = new Rect(0, 0, resolution.x, resolution.y);

    Renderer.pushRenderTarget(screenRT);
    worldShader.setVector3("red", RGB.r);
    worldShader.setVector3("green", RGB.g);
    worldShader.setVector3("blue", RGB.b);
    SpriteBatch.begin(Matrix.IDENTITY, worldShader);
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(worldRT, screenRect);
    SpriteBatch.end();
    Renderer.popRenderTarget();
    screenRT.vignette(.5);
    // screenRT.sepia();

    Renderer.pushRenderTarget(bloomRT);
    bloomSelectShader.setNumber("select", boomSelect);
    SpriteBatch.begin(Matrix.IDENTITY, bloomSelectShader);
    Renderer.setBlendMode(BlendMode.OPAQUE);
    // SpriteBatch.drawRect(screenRT, screenRect);
    SpriteBatch.drawRect(screenRT, new Rect(0, 0, bloomRT.getSize().x, bloomRT.getSize().y));
    SpriteBatch.end();
    Renderer.popRenderTarget();
    bloomRT.sepia();
    bloomRT.blur(6.4);

    var fade = 1;
    if (MainMenuData.isGameOver)
    {
        fade = 1 - MainMenuData.gameOverShownForS / 5;
    }

    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(screenRT, screenRect, new Color(fade));
    SpriteBatch.end();

    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, screenRect, new Color(boomAmount * fade));
    SpriteBatch.end();

    if (MainMenuData.isGameOver)
    {
        SpriteBatch.begin();
            Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
            Renderer.setFilterMode(FilterMode.PREMULTIPLIED);
            SpriteBatch.drawSpriteAnim(menuSkullSprite, new Vector2(resolution.x / 2, resolution.y / 2 + menuSkullAnim.get() * 8), Color.WHITE, 0, 16);
        SpriteBatch.end();
    }
}

function renderWorld()
{
    Renderer.pushRenderTarget(worldRT);
    Renderer.clear(new Color(1, 0, 0));

    // Weathers
    weather_render();

    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);

    // Ground
    var worldWidth = FocusData.focusItems.length * (distanceBetweenPlants + 50);
    SpriteBatch.drawRect(null, new Rect(-(worldWidth / 2) - 1000, 0, worldWidth + 2000, 2000), new Color(0, 0, 1));

    fertile_ground_render();

    focus_render();
    SpriteBatch.end();

    // Plants
    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
    plantVSShader.setNumber("wind", wind);
    Renderer.setVertexShader(plantVSShader);
    plants_render();
    SpriteBatch.end();

    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);
    plants_renderAction();
    butterfly_render();
    SpriteBatch.end();

    renderGameUI();
    resolution = Renderer.getResolution();

    Renderer.popRenderTarget();

    postProcess();
}

function renderGameUI()
{
    resolution = resolutionUI;

    SpriteBatch.begin(transformUI);
    Renderer.setFilterMode(FilterMode.NEAREST);
    day_render();
    resources_render();
    iceage_render();
    SpriteBatch.end();
}

function render()
{
    resolution = Renderer.getResolution();
    Renderer.setFilterMode(FilterMode.NEAREST);
    
    if (MainMenuData.isDisplaying && !(MainMenuData.isGameOver && MainMenuData.gameOverShownForS > 0))
    {
        main_menu_render()
    }
    else
    {
        renderWorld();
    }

    // In-game UI
    // renderGameUI();
}

// This UI function is only for imgui debug stuff. Not in game UI
function renderUI()
{
    debug_renderUI();
}

function init_plants()
{
    plant_create(0, PlantType.SEED);
    fertile_ground_create(-distanceBetweenPlants);
    fertile_ground_create(distanceBetweenPlants);
}

function reset_game()
{
    birdVolT = 0;
    cricketsVolT = 0;
    ResourcesData = resources_reset_data();
    uiFade = 0;
    zoomFadeDelay = 3;
    zoomFadePercent = 0;
    saveLoadTypes.forEach(function(type) {
        var resetFunction = global[toUnderScoreFromPascalCase(type).toLowerCase() + "_reset_data"];
        if (typeof resetFunction === "function")
        {
            global[type + "Data"] = resetFunction();
        }
    });
    weather_init();
    init_plants();
}
