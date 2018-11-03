var DayConstants = new (function() {
    this.timeScaleFactor = 2500;
    this.secondsPerMinute = 60;
    this.minutesPerHour = 60;
    this.hoursPerDay = 24;
    this.secondsPerDay = this.secondsPerMinute * this.minutesPerHour * this.hoursPerDay;
    this.weatherIconSize = new Vector2(21, 15);
    this.dayArrowSize = new Vector2(7, 4);
    this.daysToDisplay = 5;
});

var DayData = new (function() {
    this.currentTimeSeconds = 0;
});

var dayArrow = playSpriteAnim("day_arrow.json", "idle")

function day_update(dtSeconds)
{
    DayData.currentTimeSeconds += (DayConstants.timeScaleFactor * dtSeconds);
    if (DayData.currentTimeSeconds >= DayConstants.secondsPerDay)
    {
        DayData.currentTimeSeconds -= DayConstants.secondsPerDay;
        // 10 real-life days per in-game day
        month_update(10);
        weather_update(1);
    }
}

function day_render()
{
    var arrowPosition = new Vector2(resolution.x / 2, 3);
    SpriteBatch.drawSpriteAnim(dayArrow, arrowPosition);

    var weatherPositionShift = DayConstants.weatherIconSize.x * (DayData.currentTimeSeconds / DayConstants.secondsPerDay);
    var weatherPosition = new Vector2(arrowPosition.x - weatherPositionShift, arrowPosition.y + DayConstants.dayArrowSize.y + 2);
    WeatherData.activeWeathers.forEach(function(weatherIndex)
    {
        var weather = WeatherData.weathers[weatherIndex];
        SpriteBatch.drawSpriteAnim(weather.sprite, weatherPosition);
        weatherPosition.x += DayConstants.weatherIconSize.x;
    });
    

    // var xPos = resolution.x * (DayData.currentTimeSeconds / DayConstants.secondsPerDay);
    // SpriteBatch.drawRect(null, new Rect(xPos, resolution.y - 25, 50, 50), new Color(255,255,153));
}