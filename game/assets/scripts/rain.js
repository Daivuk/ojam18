var rains = [];

var rainS_COUNT = 40;
var rainS_TIME = 0.25;
var rain_INTENSITY = 0.15;
var rain_SPEED = 200;

var rainTexture = getTexture("rain.png");

function create_rain() 
{
    return {
        xPos: Random.randNumber(-92, 128),
        yPos: Random.randNumber(-80, -50),
        xOffset: 0,
        yOffset: 0,
        progress: Random.randNumber(rainS_TIME)
    };
}

function rain_init()
{
    for (var i = 0; i < rainS_COUNT; ++i)
    {
        rains.push(create_rain());
    }
}

function rain_update(dt)
{
    RGB.r = RGB.r.mul(0.5);
    boomSelect = 0.95;
    for (var i = 0; i < rains.length; ++i)
    {
        var rain = rains[i];
        rain.progress += dt;
        rain.xOffset -= dt * rain_SPEED;
        rain.yOffset += dt * rain_SPEED;
        if (rain.progress >= rainS_TIME)
        {
            rain = create_rain();
            rain.progress = 0;
            rains[i] = rain;
        }   
    }
}

function rain_render()
{
    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);

    for (var i = 0; i < rains.length; ++i)
    {
        var rain = rains[i];
        var percent = rain.progress / (rainS_TIME / 2);
        if (percent > 1) percent = 1 - (percent - 1);
        var leftCol = percent * rain_INTENSITY;
        var leftColor = new Color(0, leftCol, 0, leftCol);

        SpriteBatch.drawSprite(rainTexture, new Vector2(rain.xPos + cameraX + rain.xOffset, rain.yPos + rain.yOffset), leftColor);
    }

    SpriteBatch.end();
}
