var DayConstants = new (function() {
    this.timeScaleFactor = 10000;
    this.secondsPerMinute = 60;
    this.minutesPerHour = 60;
    this.hoursPerDay = 24;
    this.secondsPerDay = this.secondsPerMinute * this.minutesPerHour * this.hoursPerDay;
});

var DayData = new (function() {
    this.currentTimeSeconds = 0;
});

function day_update(dtSeconds)
{
    DayData.currentTimeSeconds += (DayConstants.timeScaleFactor * dtSeconds);
    if (DayData.currentTimeSeconds >= DayConstants.secondsPerDay)
    {
        DayData.currentTimeSeconds -= DayConstants.secondsPerDay;
        month_update(1);
    }
}

function day_render()
{
    var xPos = resolution.x * (DayData.currentTimeSeconds / DayConstants.secondsPerDay);
    SpriteBatch.drawRect(null, new Rect(xPos, resolution.y - 25, 50, 50), new Color(255,255,153));
}