// Globals
var resolution = Renderer.getResolution(); // Cache this globally
var cameraX = 0;
var cameraTargetX = 0;
var transform; // global camera transform, in case we need it elsewhere
var invTrasform; // In case we need mouse picking shit
var transformUI;
var invTransformUI;
var resolutionUI;

// Resources
var worldRT = Texture.createScreenRenderTarget();
var screenRT = Texture.createScreenRenderTarget();
var bloomRT = Texture.createScreenRenderTarget();
var worldShader = getShader("world.ps");
var bloomSelectShader = getShader("bloomSelect.ps");
var whiteData = new Uint32Array(1);
whiteData[0] = 0xFFFFFFFF;
var whiteTexture = Texture.createFromData(whiteData, Vector2.ONE);
var font = getFont("font.fnt");

// Init some crap
weather_init();
for (var i = 0; i < 10; ++i)
{
    switch (Random.randInt(0, 3))
    {
        case 0: plant_create(i * 30, PlantType.SEED); break;
        case 1: plant_create(i * 30, PlantType.SOLAR); break;
        case 2: plant_create(i * 30, PlantType.WATER); break;
        case 3: plant_create(i * 30, PlantType.NORMAL); break;
    }
}


function update(dt)
{
    resolution = Renderer.getResolution();

    // Move camera...
    cameraTargetX = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData.position;
    cameraX = cameraX + (cameraTargetX - cameraX) * 10 * dt;

    // Update world matrix
    var scale = 8.0;

    transform = Matrix.IDENTITY;
    transform = transform.mul(Matrix.createTranslation(new Vector3(-cameraX, 0, 0)));
    transform = transform.mul(Matrix.createScale(scale));
    transform = transform.mul(Matrix.createTranslation(new Vector3(resolution.x * 0.5, resolution.y * .8, 0)));
    invTrasform = transform.invert();

    // Update UI matrix
    var uiscale = 240.0 / resolution.y;
    resolutionUI = new Vector2(resolution.x * uiscale, resolution.y * uiscale);
    transformUI = Matrix.createScale(1.0 / uiscale);
    invTransformUI = transformUI.invert();

    focus_update();
    
    // hues, saturation and brightness
    updateHSV(dt);

    debug_update(dt); // Debug menu
    if (!showDebug)
    {
        day_update(dt);
        plants_update(dt);
    }
    weather_updateActive(dt);
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

    Renderer.pushRenderTarget(bloomRT);
    bloomSelectShader.setNumber("select", 0.8);
    SpriteBatch.begin(Matrix.IDENTITY, bloomSelectShader);
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(screenRT, screenRect);
    SpriteBatch.end();
    Renderer.popRenderTarget();
    bloomRT.sepia();
    bloomRT.blur(32);

    Renderer.clear(new Color(0, 0, 0));

    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(screenRT, screenRect);
    SpriteBatch.end();
    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, screenRect);
    SpriteBatch.end();
}

function renderWorld()
{
    Renderer.pushRenderTarget(worldRT);
    Renderer.clear(new Color(1, 0, 0));

    // Weathers
    weather_render();

    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);

    focus_render();

    // Plants
    plants_render();

    // Ground
    SpriteBatch.drawRect(null, new Rect(-1000, 0, 2000, 2000), new Color(0, 0, 1));

    SpriteBatch.end();

    Renderer.popRenderTarget();

    postProcess();
}

function renderGameUI()
{
    resolution = resolutionUI;

    SpriteBatch.begin(transformUI);
    Renderer.setFilterMode(FilterMode.NEAREST);
    day_render();
    month_render();
    season_render();
    weather_render();
    SpriteBatch.end();
}

function render()
{
    resolution = Renderer.getResolution();

    Renderer.clear(Color.fromHexRGB(0x306082));
    Renderer.setFilterMode(FilterMode.NEAREST);

    // World
    renderWorld();

    // In-game UI
    renderGameUI();
}

// This UI function is only for imgui debug stuff. Not in game UI
function renderUI()
{
    debug_renderUI();
}
