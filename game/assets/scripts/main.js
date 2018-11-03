plant_create(0.0, PlantType.WATER);
plant_create(20.0, PlantType.SOLAR);
plant_create(50.0, PlantType.SEED);
plant_create(75.0, PlantType.NORMAL);

plant_progress(plants[1], 100);
plant_progress(plants[2], 225);
plant_progress(plants[3], 375);

function update(dt)
{
}

function render()
{
    Renderer.clear(Color.fromHexRGB(0x306082));
    Renderer.setFilterMode(FilterMode.NEAREST);

    var screenRes = Renderer.getResolution();

    var scale = 4.0;
    var translation = new Vector3((screenRes.x / scale) / 2, (screenRes.y / scale) / 2, 0.0)
    SpriteBatch.begin(Matrix.createTranslation(translation).mul(Matrix.createScale(new Vector3(scale, scale, 1.0))));

    plants_render();

    SpriteBatch.end();
}

function renderUI()
{
}
