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
    this.currentTimeSeconds = 6 * 60 * 60; // start at 6 am
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

    for (var i = 0; i < WeatherData.activeWeathers.length; ++i)
    {
        var weather = WeatherData.weathers[WeatherData.activeWeathers[i]];
        if (i == WeatherData.activeWeathers.length - 1)
            SpriteBatch.drawSpriteAnim(weather.sprite, weatherPosition.add(incomingCardAnim.get()));
        else
            SpriteBatch.drawSpriteAnim(weather.sprite, weatherPosition);
        weatherPosition.x += DayConstants.weatherIconSize.x;
    };

    if (droppingCard.weather)
    {
        SpriteBatch.drawSpriteAnim(droppingCard.weather.sprite, droppingCard.anim.get());
    }
    

    // var xPos = resolution.x * (DayData.currentTimeSeconds / DayConstants.secondsPerDay);
    // SpriteBatch.drawRect(null, new Rect(xPos, resolution.y - 25, 50, 50), new Color(255,255,153));
}

function day_getLightLevel()
{
    var seasonTable = rgbTable[SeasonConstants.seasons[season_get_current_season_index()]];
    var time = DayData.currentTimeSeconds / 60 / 60; // in hours

    if (time < seasonTable.dawnTime - seasonTable.spread)
    {
        return 0;
    }
    else if (time < seasonTable.dawnTime + seasonTable.spread)
    {
        return (time - (seasonTable.dawnTime - seasonTable.spread)) / (seasonTable.spread * 2);
    }
    else if (time < seasonTable.duskTime - seasonTable.spread)
    {
        return 1;
    }
    else if (time < seasonTable.duskTime + seasonTable.spread)
    {
        return 1 - (time - (seasonTable.duskTime - seasonTable.spread)) / (seasonTable.spread * 2);
    }
    else
    {
        return 0;
    }
}
