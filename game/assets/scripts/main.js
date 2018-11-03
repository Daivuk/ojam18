plant_create(0.0, PlantType.WATER);
plant_create(20.0, PlantType.SOLAR);
plant_create(50.0, PlantType.SEED);

plant_progress(plants[1], 100);
plant_progress(plants[2], 225);

function update(dt)
{
}

function render()
{
    Renderer.clear(Color.fromHexRGB(0x1d232d));

    var screenRes = Renderer.getResolution();

    SpriteBatch.begin(Matrix.createTranslation(new Vector3(screenRes.x / 2, screenRes.y / 2, 0.0)));

    plants_render();

    SpriteBatch.end();
}

function renderUI()
{
}
