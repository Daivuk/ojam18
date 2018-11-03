var WeatherConstants = {
    weatherTypes: ["sunny", "cloudy", "rainy", "stormy", "snowy"],
    sunny: 0,
    cloudy: 1,
    rainy: 2,
    stormy: 3,
    snowy: 4
}

var WeatherData = {
    activeWeathers: [],
    weathers: []
}

var droppingCard = {
    weather: null,
    anim: new Vector2Anim()
};
var incomingCardAnim = new Vector2Anim();

function weather_update(dtDays)
{
    // Remove old weather and add a new one.
    droppingCard.weather = WeatherData.weathers[WeatherData.activeWeathers.shift()];

    var arrowPosition = new Vector2(resolutionUI.x / 2, 3);
    var weatherPosition = new Vector2(arrowPosition.x - DayConstants.weatherIconSize.x, arrowPosition.y + DayConstants.dayArrowSize.y + 2);

    droppingCard.anim.stop();
    droppingCard.anim.set(weatherPosition);
    droppingCard.anim.queue(new Vector2(-DayConstants.weatherIconSize.x, weatherPosition.y), 1, Tween.EASE_IN, function()
    {
        droppingCard.weather = null;
    });
    droppingCard.anim.play();

    incomingCardAnim.stop();
    incomingCardAnim.playSingle(new Vector2(resolutionUI.x / 2, 0), Vector2.ZERO, 1, Tween.BOUNCE_OUT);

    WeatherData.activeWeathers.push(getRandomInt(0, 4));
}

function weather_updateActive(dt)
{
    var activeWeather = WeatherData.activeWeathers[0];
    switch (activeWeather)
    {
        case WeatherConstants.sunny:
        {
            sunny_update(dt);
            break;
        }
        case WeatherConstants.cloudy:
        {
            cloud_update(dt);
            break;
        }
        case WeatherConstants.rainy:
        {
            cloud_update(dt);
            rain_update(dt);
            break;
        }
        case WeatherConstants.stormy:
        {
            lightning_update(dt);
            cloud_update(dt);
            rain_update(dt);
            break;
        }
        case WeatherConstants.snowy:
        {
            cloud_update(dt);
            snow_update(dt);
            break;
        }
    }
}

function weather_render()
{
    var activeWeather = WeatherData.activeWeathers[0];
    switch (activeWeather)
    {
        case WeatherConstants.sunny:
        {
            sunny_render();
            break;
        }
        case WeatherConstants.cloudy:
        {
            cloud_render();
            break;
        }
        case WeatherConstants.rainy:
        {
            rain_render();
            cloud_render();
            break;
        }
        case WeatherConstants.stormy:
        {
            lightning_render();
            rain_render();
            cloud_render();
            break;
        }
        case WeatherConstants.snowy:
        {
            snow_render();
            cloud_render();
            break;
        }
    }
}

function weather_getSunMultiplier()
{
    var activeWeather = WeatherData.activeWeathers[0];
    switch (activeWeather)
    {
        case WeatherConstants.sunny:
        {
            return 1.0;
            break;
        }
        case WeatherConstants.cloudy:
        {
            return 0.5;
            break;
        }
        case WeatherConstants.rainy:
        {
            return 0.25;
            break;
        }
        case WeatherConstants.stormy:
        {
            return 0.25;
            break;
        }
        case WeatherConstants.snowy:
        {
            return 0.5;
            break;
        }
    }

    return 0.0;
}

function weather_getWaterMultiplier()
{
    var activeWeather = WeatherData.activeWeathers[0];
    switch (activeWeather)
    {
        case WeatherConstants.sunny:
        {
            return 0.25;
            break;
        }
        case WeatherConstants.cloudy:
        {
            return 0.25;
            break;
        }
        case WeatherConstants.rainy:
        {
            return 1.0;
            break;
        }
        case WeatherConstants.stormy:
        {
            return 1.0;
            break;
        }
        case WeatherConstants.snowy:
        {
            return 0.5;
            break;
        }
    }

    return 0.0;
}

function weather_init()
{
    sunny_init();
    cloud_init();
    rain_init();
    lightning_init();
    snow_init();
    
    WeatherConstants.weatherTypes.forEach(function(weatherType) {
        var weather = {
            type: weatherType,
            sprite: playSpriteAnim("days.json", weatherType)
        };
    
        WeatherData.weathers.push(weather);
    });

    for (var i = 0; i < DayConstants.daysToDisplay; i++)
    {
        WeatherData.activeWeathers.push(getRandomInt(0, 4));
    }

    // Always start with 2 days of sunny
    WeatherData.activeWeathers[0] = WeatherConstants.sunny;
    WeatherData.activeWeathers[1] = WeatherConstants.sunny;
}
