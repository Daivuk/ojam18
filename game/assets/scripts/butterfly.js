var butterflies = [];
var BUTTERFLY_SPEED = 20;
var BUTTERFLY_CHANGE_POS_TIMOUT = 0.5;

function butterfly_create()
{
    var area = (FocusData.focusItems.length + 1) * (distanceBetweenPlants);
    var butterfly = {
        position: new Vector2(FocusData.focusItems[0].itemData.position - distanceBetweenPlants * 0.5 + Random.randNumber(area), Random.randNumber(-32, -16)),
        sprite: playSpriteAnim("butterfly.json", "fly"),
        direction: Vector2.ZERO,
        changeDirTimeout: Random.randNumber(BUTTERFLY_CHANGE_POS_TIMOUT)
    };
    butterfly.startPosition = butterfly.position;
    return butterfly;
}

function butterfly_update(dt)
{
    var butterflyExpectCount = FocusData.focusItems.length;
    switch (season_get_current_season_index())
    {
        case SeasonConstants.summer: butterflyExpectCount *= 1.0; break;
        case SeasonConstants.spring: butterflyExpectCount *= 0.5; break;
        case SeasonConstants.fall: butterflyExpectCount *= 0.2; break;
        default: butterflyExpectCount = 0; break;
    }
    butterflyExpectCount = Math.floor(butterflyExpectCount);
    butterflyExpectCount = Math.min(20, butterflyExpectCount);

    while (butterflies.length > butterflyExpectCount) butterflies.shift();
    while (butterflies.length < butterflyExpectCount)
    {
        butterflies.push(butterfly_create());
    }

    var left = FocusData.focusItems[0].itemData.position - distanceBetweenPlants * 0.5;
    var right = left + (FocusData.focusItems.length + 1) * (distanceBetweenPlants);

    butterflies.forEach(function(butterfly)
    {
        butterfly.changeDirTimeout -= dt;
        if (butterfly.changeDirTimeout <= 0)
        {
            butterfly.changeDirTimeout = BUTTERFLY_CHANGE_POS_TIMOUT;
            butterfly.direction = Random.randCircle(Vector2.ZERO, 1);
        }
        butterfly.position = butterfly.position.add(butterfly.direction.mul(dt * BUTTERFLY_SPEED));
        butterfly.position.x = Math.min(butterfly.position.x, right);
        butterfly.position.x = Math.max(butterfly.position.x, left);
        butterfly.position.y = Math.min(butterfly.position.y, -16);
        butterfly.position.y = Math.max(butterfly.position.y, -32);
    });
}

function butterfly_render()
{
    var t = day_getLightLevel();
    var color = new Color(t);
    if (WeatherData.activeWeathers[0] != WeatherConstants.sunny) return;

    butterflies.forEach(function(butterfly)
    {
        SpriteBatch.drawSpriteAnim(butterfly.sprite, butterfly.position, color, 0, 0.5);
    });
}
