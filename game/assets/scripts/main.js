var resolution = Renderer.getResolution(); // Cache this globally
var transform; // global camera transform, in case we need it elsewhere
var invTrasform; // In case we need mouse picking shit
var transformUI;
var invTransformUI;
var resolutionUI;

plant_create(0.0, PlantType.WATER);
plant_create(20.0, PlantType.SOLAR);
plant_create(50.0, PlantType.SEED);
plant_create(75.0, PlantType.NORMAL);

plant_progress(plants[1], 100);
plant_progress(plants[2], 225);
plant_progress(plants[3], 375);

weather_add(WeatherType.CLOUDY);
weather_add(WeatherType.RAINY);
weather_add(WeatherType.SNOWY);
weather_add(WeatherType.STORMY);
weather_add(WeatherType.SUNNY);

var worldShader = getShader("world.ps");

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

    debug_update(dt); // Debug menu
    if (!showDebug)
    {
        day_update(dt);
    }
}

function render()
{
    resolution = Renderer.getResolution();

    Renderer.clear(Color.fromHexRGB(0x306082));
    Renderer.setFilterMode(FilterMode.NEAREST);

    // World
    SpriteBatch.begin(transform, worldShader);
    plants_render();
    SpriteBatch.drawRect(null, new Rect(-1000, 0, 2000, 2000), Color.fromHexRGB(0x222034));
    SpriteBatch.end();

    // In-game UI
    resolution = resolutionUI;

    SpriteBatch.begin(transformUI);
    day_render();
    month_render();
    season_render();
    weather_render();
    SpriteBatch.end();
}

// This UI function is only for imgui debug stuff. Not in game UI
function renderUI()
{
    debug_renderUI();
}
