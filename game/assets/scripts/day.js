var DayConstants = new (function() {
    this.timeScaleFactorDefault = 2500;
    this.secondsPerMinute = 60;
    this.minutesPerHour = 60;
    this.hoursPerDay = 24;
    this.secondsPerDay = this.secondsPerMinute * this.minutesPerHour * this.hoursPerDay;
    this.weatherIconSize = new Vector2(21, 15);
    this.dayArrowSize = new Vector2(7, 4);
    this.daysToDisplay = 5;
    this.weatherUISize = new Vector2(this.weatherIconSize.x * this.daysToDisplay, this.weatherIconSize.y);
    this.fastForwardSprite = playSpriteAnim("icons.json", "fastforward");
});

var DayData = new (function() {
    this.currentTimeSeconds = 6 * 60 * 60; // start at 6 am
    this.dtMsSinceLastShift = 0;
    this.timeScaleFactor = 2500;
    this.weatherUIPosition = new Vector2();
});

var DayDataSaveProperties = [
    "currentTimeSeconds"
];

var dayArrow = playSpriteAnim("day_arrow.json", "idle");

function day_update(dtSeconds)
{
    DayData.timeScaleFactor = DayConstants.timeScaleFactorDefault;
    if (Input.isDown(Key.LEFT_SHIFT))
    {
        if (DayData.dtMsSinceLastShift < 100)
        {
            DayData.timeScaleFactor = DayConstants.timeScaleFactorDefault * 8;
        }
        else
        {
            DayData.timeScaleFactor = DayConstants.timeScaleFactorDefault * 4;
        }
    }
    else
    {
        DayData.dtMsSinceLastShift += dtSeconds * 1000;
    }
    if (Input.isJustUp(Key.LEFT_SHIFT))
    {
        DayData.dtMsSinceLastShift = 0;
    }
    
    DayData.currentTimeSeconds += (DayData.timeScaleFactor * dtSeconds);
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
    var arrowPosition = new Vector2(resolution.x / 3, 3);
    SpriteBatch.drawSpriteAnim(dayArrow, arrowPosition, zoomFadeColor);
    var invP = 1 - zoomFadePercent;
    invP *= invP;

    var weatherPositionShift = DayConstants.weatherIconSize.x * (DayData.currentTimeSeconds / DayConstants.secondsPerDay);
    var weatherPosition = new Vector2(arrowPosition.x - weatherPositionShift, arrowPosition.y + DayConstants.dayArrowSize.y + 2 - invP * 30);
    DayData.weatherUIPosition = weatherPosition;

    var color = new Color(.75, .75, .75, 1);

    for (var i = 0; i < WeatherData.activeWeathers.length; ++i)
    {
        var percent = 1 - i / WeatherData.activeWeathers.length;
        var weather = WeatherData.weathers[WeatherData.activeWeathers[i]];
        if (i == WeatherData.activeWeathers.length - 1)
            SpriteBatch.drawSpriteAnim(weather.sprite, weatherPosition.add(incomingCardAnim.get()), color.mul(percent * zoomFadePercent));
        else
            SpriteBatch.drawSpriteAnim(weather.sprite, weatherPosition, color.mul(percent * zoomFadePercent));
        weatherPosition.x += DayConstants.weatherIconSize.x;
    };

    if (droppingCard.weather)
    {
        SpriteBatch.drawSpriteAnim(droppingCard.weather.sprite, droppingCard.anim.get(), color.mul(droppingCard.alphaAnim.get() * zoomFadePercent));
    }

    if (DayData.timeScaleFactor >= DayConstants.timeScaleFactorDefault * 8)
    {
        SpriteBatch.drawSpriteAnim(DayConstants.fastForwardSprite, new Vector2(resolution.x / 2 - 6, 30), zoomFadeColor);
        SpriteBatch.drawSpriteAnim(DayConstants.fastForwardSprite, new Vector2(resolution.x / 2 + 6, 30), zoomFadeColor);
    }
    else if (DayData.timeScaleFactor >= DayConstants.timeScaleFactorDefault * 4)
    {
        SpriteBatch.drawSpriteAnim(DayConstants.fastForwardSprite, new Vector2(resolution.x / 2, 30), zoomFadeColor);
    }
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
