var clouds = [];

var CLOUDS_COUNT = 20;
var CLOUDS_TIME = 4;
var CLOUD_INTENSITY = .5;

var cloudTexture = getTexture("cloud.png");

function create_cloud()
{
    return {
        xPos: Random.randNumber(-48, 92),
        yPos: Random.randNumber(-80, -50),
        xOffset: 0,
        progress: Random.randNumber(CLOUDS_TIME),
        parralax: Random.randNumber(1, 4)
    };
}

function cloud_init()
{
    for (var i = 0; i < CLOUDS_COUNT; ++i)
    {
        clouds.push(create_cloud());
    }
}

function cloud_update(dt)
{
    RGB.r = RGB.r.mul(0.5);
    boomSelect = 0.95;
    for (var i = 0; i < clouds.length; ++i)
    {
        var cloud = clouds[i];
        cloud.progress += dt;
        cloud.xOffset -= cloud.parralax * dt * 5;
        if (cloud.progress >= CLOUDS_TIME)
        {
            cloud = create_cloud();
            cloud.progress = 0;
            clouds[i] = cloud;
        }
    }
}

function cloud_render()
{
    SpriteBatch.begin(transform);
    Renderer.setFilterMode(FilterMode.LINEAR);
    Renderer.setBlendMode(BlendMode.PREMULTIPLIED);

    for (var i = 0; i < clouds.length; ++i)
    {
        var cloud = clouds[i];
        var percent = cloud.progress / (CLOUDS_TIME / 2);
        if (percent > 1) percent = 1 - (percent - 1);
        var leftCol = percent * CLOUD_INTENSITY;
        var leftColor = new Color(0, leftCol * 0.5, leftCol, leftCol);

        SpriteBatch.drawSprite(cloudTexture, new Vector2(cloud.xPos + cameraX + cloud.xOffset, cloud.yPos), leftColor, 0, 3);
    }

    SpriteBatch.end();
    Renderer.setFilterMode(FilterMode.NEAREST);
}
