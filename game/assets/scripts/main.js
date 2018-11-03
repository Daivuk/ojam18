plant_create(0.0);

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
