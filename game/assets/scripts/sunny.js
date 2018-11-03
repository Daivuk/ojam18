var sunRays = [];

var RAYS_COUNT = 20;
var RAYS_TIME = 8;
var STARS_INTENSITY = 1;
var RAYS_INTENSITY = .25;

function create_ray()
{
    return {
        xPos: Random.randNumber(-64, 64),
        yPos: Random.randNumber(-64, -16),
        xOffset: 0,
        progress: Random.randNumber(RAYS_TIME),
        parralax: Random.randNumber(1, 4)
    };
}

function sunny_init()
{
    for (var i = 0; i < RAYS_COUNT; ++i)
    {
        sunRays.push(create_ray());
    }
}

function sunny_update(dt)
{
    for (var i = 0; i < sunRays.length; ++i)
    {
        var sunRay = sunRays[i];
        sunRay.progress += dt;
        sunRay.xOffset -= sunRay.parralax * dt;
        if (sunRay.progress >= RAYS_TIME)
        {
            sunRay = create_ray();
            sunRay.progress = 0;
            sunRays[i] = sunRay;
        }
    }
}

function sunny_render()
{
    var t = day_getLightLevel();
    if (t > 0)
    {
        PrimitiveBatch.begin(PrimitiveMode.TRIANGLE_LIST, null, transform);
        Renderer.setBlendMode(BlendMode.ADD);

        for (var i = 0; i < sunRays.length; ++i)
        {
            var sunRay = sunRays[i];
            var percent = sunRay.progress / (RAYS_TIME / 2);
            if (percent > 1) percent = 1 - (percent - 1);
            var leftCol = percent * RAYS_INTENSITY * t;
            var rightCol = percent * RAYS_INTENSITY * t;
            var leftColor = new Color(0, leftCol, 0, leftCol);
            var rightColor = new Color(0, rightCol, 0, rightCol);
            var x = sunRay.xPos + sunRay.xOffset;

            PrimitiveBatch.draw(new Vector2(x, sunRay.yPos), leftColor.mul(0.25));
            PrimitiveBatch.draw(new Vector2(x + 16, sunRay.yPos), rightColor.mul(0.25));
            PrimitiveBatch.draw(new Vector2(x + 32, sunRay.yPos - 64), rightColor);

            PrimitiveBatch.draw(new Vector2(x, sunRay.yPos), leftColor.mul(0.25));
            PrimitiveBatch.draw(new Vector2(x + 32, sunRay.yPos - 64), rightColor);
            PrimitiveBatch.draw(new Vector2(x + 32 - 16, sunRay.yPos - 64), leftColor);
        }

        PrimitiveBatch.end();
    }
    if (t < 1)
    {
        t = 1 - t;
        SpriteBatch.begin(transform);
        Renderer.setBlendMode(BlendMode.ADD);

        for (var i = 0; i < sunRays.length; ++i)
        {
            var sunRay = sunRays[i];
            var percent = sunRay.progress / (RAYS_TIME / 2);
            if (percent > 1) percent = 1 - (percent - 1);
            var leftCol = percent * STARS_INTENSITY * t;
            var leftColor = new Color(0, leftCol, 0, leftCol);

            SpriteBatch.drawSprite(null, new Vector2(sunRay.xPos, sunRay.yPos), leftColor, 0, .5);
        }

        SpriteBatch.end();
    }
}
