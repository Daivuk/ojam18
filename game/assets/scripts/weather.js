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

function weather_render()
{
}

function weather_init()
{
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
}
weather_init();
