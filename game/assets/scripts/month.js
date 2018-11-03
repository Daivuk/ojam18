var MonthConstants = new (function() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.font = getFont("font.fnt");
});

var MonthData = new (function() {
    this.currentDay = 0;
});

function month_update(dtDays)
{
    MonthData.currentDay += dtDays;
   if (MonthData.currentDay == (MonthConstants.daysPerMonth[SeasonData.currentMonth] - 1))
   {
       MonthData.currentDay = 0;
       season_update(1);
   }
}

function month_render()
{
    SpriteBatch.drawText(MonthConstants.font, MonthConstants.months[SeasonData.currentMonth], new Vector2(0, 15), new Vector2(), new Color());
}
