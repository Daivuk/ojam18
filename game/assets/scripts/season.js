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
});

var SeasonData = new (function() {
    this.currentMonth = MonthConstants.march;
});

var SeasonDataSaveProperties = [
    "currentMonth"
];

function season_get_season_for_day_offset(dayOffset)
{
    var newDay = MonthData.currentDay + dayOffset;
    var newMonth = SeasonData.currentMonth;
    
    while (newDay >= (MonthConstants.daysPerMonth[newMonth] - 1))
    {
        newDay -= MonthConstants.daysPerMonth[newMonth] - 1;

        if (newMonth == MonthConstants.december)
        {
            newMonth = MonthConstants.january;
        }
        else
        {
            newMonth++;
        }
    }

    return season_get_season_for_date(newDay, newMonth);
}

function season_get_current_season_index()
{
    return season_get_season_for_date(MonthData.currentDay, SeasonData.currentMonth);
}

function season_get_season_for_date(day, month)
{
    switch(month)
    {
        case MonthConstants.january:
        case MonthConstants.february:
            return SeasonConstants.winter;
        case MonthConstants.march:
            if (day >= 20) 
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
            if (day >= 21)
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
            if (day >= 21)
            {
                return SeasonConstants.fall;
            }
            else
            {
                return SeasonConstants.summer;
            }
        case MonthConstants.october:
        case MonthConstants.november:
            return SeasonConstants.fall;
        case MonthConstants.december:
            if (day >= 21)
            {
                return SeasonConstants.winter;
            }
            else
            {
                return SeasonConstants.fall;
            }        
    }
}

function season_get_weathers_for_season(season)
{
    var weathers = [];
    weathers.push(WeatherConstants.sunny);
    weathers.push(WeatherConstants.cloudy);

    switch(season)
    {
        case SeasonConstants.fall:
        case SeasonConstants.spring:
        case SeasonConstants.summer:
            weathers.push(WeatherConstants.rainy);
            weathers.push(WeatherConstants.stormy);
            break;

        case SeasonConstants.winter:
            weathers.push(WeatherConstants.snowy);
            break;
    }

    return weathers;
}

function season_update(dtMonths)
{
    if (SeasonData.currentMonth == MonthConstants.december)
    {
        print("" + SeasonData.currentMonth);
        SeasonData.currentMonth = MonthConstants.january;
    }
    else
    {
        SeasonData.currentMonth += dtMonths;
    }
}
