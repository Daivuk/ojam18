var resolution = Renderer.getResolution(); // Cache this globally

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

function update(dt)
{
    resolution = Renderer.getResolution();

    debug_update(dt);
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

    var scale = 4.0;
    var translation = new Vector3((resolution.x / scale) / 2, (resolution.y / scale) / 2, 0.0)
    SpriteBatch.begin(Matrix.createTranslation(translation).mul(Matrix.createScale(new Vector3(scale, scale, 1.0))));

    plants_render();

    SpriteBatch.end();

    SpriteBatch.begin();

    day_render();
    month_render();
    season_render();
    
    SpriteBatch.end();


    // In game UI
    var scale = 4.0;
    SpriteBatch.begin(Matrix.createScale(new Vector3(scale, scale, 1.0)))

    weather_render();

    SpriteBatch.end();
}

function renderUI()
{
    debug_renderUI();
}
