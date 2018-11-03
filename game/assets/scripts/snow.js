var snows = [];

var snowS_COUNT = 200;
var snowS_TIME = 4;
var snow_INTENSITY = 1;
var snow_SPEED = 20;

function create_snow() 
{
    return {
        xPos: Random.randNumber(-92, 128),
        yPos: Random.randNumber(-80, -50),
        xOffset: 0,
        yOffset: 0,
        progress: Random.randNumber(snowS_TIME)
    };
}

function snow_init()
{
    for (var i = 0; i < snowS_COUNT; ++i)
    {
        snows.push(create_snow());
    }
}

function snow_update(dt)
{
    RGB.r = RGB.r.mul(0.5);
    boomSelect = 0.95;
    for (var i = 0; i < snows.length; ++i)
    {
        var snow = snows[i];
        snow.progress += dt;
        snow.xOffset -= dt * snow_SPEED;
        snow.yOffset += dt * snow_SPEED;
        if (snow.progress >= snowS_TIME)
        {
            snow = create_snow();
            snow.progress = 0;
            snows[i] = snow;
        }   
    }
}

function snow_render()
{
    SpriteBatch.begin(transform);
    Renderer.setBlendMode(BlendMode.PREMULIPLIED);

    for (var i = 0; i < snows.length; ++i)
    {
        var snow = snows[i];
        var percent = snow.progress / (snowS_TIME / 2);
        if (percent > 1) percent = 1 - (percent - 1);
        var leftCol = percent * snow_INTENSITY;
        var leftColor = new Color(0, leftCol, 0, leftCol);

        SpriteBatch.drawSprite(null, new Vector2(snow.xPos + cameraX + snow.xOffset, snow.yPos + snow.yOffset), leftColor);
    }

    SpriteBatch.end();
}
