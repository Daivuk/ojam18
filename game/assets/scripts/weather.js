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

function weather_update(dtDays)
{
    // Remove old weather and add a new one.
    WeatherData.activeWeathers.shift();
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
            cloud_update(dt);
            rain_update(dt);
            break;
        }
        case WeatherConstants.snowy:
        {
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
            rain_render();
            cloud_render();
            break;
        }
        case WeatherConstants.snowy:
        {
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
