// Globals
var resolution = Renderer.getResolution(); // Cache this globally
var transform; // global camera transform, in case we need it elsewhere
var invTrasform; // In case we need mouse picking shit
var transformUI;
var invTransformUI;
var resolutionUI;
var worldRT = Texture.createScreenRenderTarget();

// Resources
var worldShader = getShader("world.ps");
var whiteData = new Uint32Array(1);
whiteData[0] = 0xFFFFFFFF;
var whiteTexture = Texture.createFromData(whiteData, Vector2.ONE);

plant_create(0.0, PlantType.SEED);
plant_create(20.0, PlantType.SEED);

function update(dt)
{
    resolution = Renderer.getResolution();

    // Move camera...

    // Update world matrix
    var scale = 8.0;
    var translation = new Vector3((resolution.x / scale) / 2, (resolution.y / scale) * .8, 0.0)
    transform = Matrix.createTranslation(translation).mul(Matrix.createScale(new Vector3(scale, scale, 1.0)));
    invTrasform = transform.invert();

    // Update UI matrix
    var uiscale = 240.0 / resolution.y;
    resolutionUI = new Vector2(resolution.x * uiscale, resolution.y * uiscale);
    transformUI = Matrix.createScale(1.0 / uiscale);
    invTransformUI = transformUI.invert();

    plants_update(dt);

    focus_update();
    
    // hues, saturation and brightness
    updateHSV(dt);

    debug_update(dt); // Debug menu
    if (!showDebug)
    {
        day_update(dt);
    }
}

function renderWorld()
{
    Renderer.pushRenderTarget(worldRT);
    Renderer.clear(new Color(1, 0, 0));

    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);

    // Ground
    SpriteBatch.drawRect(null, new Rect(-1000, 0, 2000, 2000), new Color(0, 0, 1));

    focus_render();

    // Plants
    plants_render();

    SpriteBatch.end();
    Renderer.popRenderTarget();

    worldShader.setVector3("red", RGB.r);
    worldShader.setVector3("green", RGB.g);
    worldShader.setVector3("blue", RGB.b);
    SpriteBatch.begin(Matrix.IDENTITY, worldShader);
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(worldRT, new Rect(0, 0, resolution.x, resolution.y));
    SpriteBatch.end();
}

function renderGameUI()
{
    resolution = resolutionUI;

    SpriteBatch.begin(transformUI);
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
