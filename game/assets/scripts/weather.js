var weathers = [];

var WeatherType = {
    SUNNY: "sunny",
    CLOUDY: "cloudy",
    RAINY: "rainy",
    STORMY: "stormy",
    SNOWY: "snowy"
}

function weather_add(_type)
{
    var weather = {
        type: _type
    };

    weathers.push(weather);
}

function weather_update(dt)
{
}

function weather_render()
{
    for(var i = 0; i < weathers.length; ++i)
    {
        var sprite = playSpriteAnim("days.json", weathers[i].type);

        SpriteBatch.drawSpriteAnim(sprite, new Vector2(i * 21, 0.0));
    }
}
