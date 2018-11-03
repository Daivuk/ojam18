// Ottawa Seasons
// Spring - March 20 to June 20 
// Summer - June 21 to September 21 
// Fall - September 22 to December 20
// Winter - December 21 to March 19

var SeasonConstants = new (function() {
    this.seasons = ["Winter", "Spring", "Summer", "Fall"];
    this.font = getFont("font.fnt");
});

var SeasonData = new (function() {
    this.currentMonth = 0;
});

function season_update(dtMonths)
{
    SeasonData.currentMonth += dtMonths;
}

function season_render()
{
    //var currentSeason;
    //SpriteBatch.drawText(SeasonConstants.font, cure, new Vector2(0, 30), new Vector2(), new Color());
}
