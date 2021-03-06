var MonthConstants = new (function() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.january = 0;
    this.february = 1;
    this.march = 2;
    this.april = 3;
    this.may = 4;
    this.june = 5;
    this.july = 6;
    this.august = 7;
    this.september = 8;
    this.october = 9;
    this.november = 10;
    this.december = 11;
});

function month_reset_data()
{
    return new (function() {
        this.currentDay = 20;
    });
}

var MonthData = month_reset_data();

var MonthDataSaveProperties = [
    "currentDay"
];

function month_update(dtDays)
{
    MonthData.currentDay += dtDays;
   if (MonthData.currentDay >= (MonthConstants.daysPerMonth[SeasonData.currentMonth] - 1))
   {
       MonthData.currentDay = 0;
       season_update(1);
   }
}
