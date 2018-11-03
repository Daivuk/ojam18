// Ottawa Seasons
// Spring - March 20 to June 20 
// Summer - June 21 to September 21 
// Fall - September 22 to December 20
// Winter - December 21 to March 19

var SeasonConstants = new (function() {
    this.seasons = ["Spring", "Summer", "Fall", "Winter"];
    this.spring = 0;
    this.summer = 1;
    this.fall = 2;
    this.winter = 3;
    this.font = getFont("font.fnt");
});

var SeasonData = new (function() {
    this.currentMonth = MonthConstants.march;
});

function season_get_current_season_index()
{
    switch(SeasonData.currentMonth)
    {
        case MonthConstants.january:
        case MonthConstants.february:
            return SeasonConstants.winter;
        case MonthConstants.march:
            if (MonthData.currentDay >= 20) 
            {
                return SeasonConstants.spring;
            }
            else
            {
                return SeasonConstants.winter;
            }
        case MonthConstants.april:
        case MonthConstants.may:
            return SeasonConstants.spring;
        case MonthConstants.june:
            if (MonthData.currentDay >= 21)
            {
                return SeasonConstants.summer;
            }
            else
            {
                return SeasonConstants.spring;
            }
        case MonthConstants.july:
        case MonthConstants.august:
            return SeasonConstants.summer;
        case MonthConstants.september:
            if (MonthData.currentDay >= 21)
            {
                return SeasonConstants.fall;
            }
            else
            {
                return SeasonConstants.spring;
            }
        case MonthConstants.october:
        case MonthConstants.november:
            return SeasonConstants.fall;
        case MonthConstants.december:
            if (MonthConstants.currentDay >= 21)
            {
                return SeasonConstants.winter;
            }
            else
            {
                return SeasonConstants.fall;
            }        
    }
}

function season_update(dtMonths)
{
    SeasonData.currentMonth += dtMonths;
}

function season_render()
{
    SpriteBatch.drawText(SeasonConstants.font, SeasonConstants.seasons[season_get_current_season_index()], new Vector2(0, 30), new Vector2(), new Color());
}
