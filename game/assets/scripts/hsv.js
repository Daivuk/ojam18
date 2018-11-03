var rgbTable = [];
// Load hsv table for colors
{
    var file = new BinaryFileReader("hsv.json");
    rgbTable = JSON.parse(file.readString());
}

var RGB = {r: new Color(1, 0, 0, 1), g: new Color(0, 1, 0, 1), b: new Color(0, 0, 1, 1)};

function updateHSV(dt)
{
    var seasonTable = rgbTable[SeasonConstants.seasons[season_get_current_season_index()]];
    // var time = DayData.currentTimeSeconds / 60 / 60; // in hours

    var percent = day_getLightLevel();
    var from = seasonTable.night;
    var to = seasonTable.day;

    boomSelect = seasonTable.bloomSelect;
    boomAmount = seasonTable.bloomAmount;

    // if (time < seasonTable.dawnTime - seasonTable.spread)
    // {
    //     from = seasonTable.night;
    //     to = from;
    // }
    // else if (time < seasonTable.dawnTime)
    // {
    //     percent = 1 - (seasonTable.dawnTime - time) / seasonTable.spread;
    //     from = seasonTable.night;
    //     to = seasonTable.dawn;
    // }
    // else if (time < seasonTable.dawnTime + seasonTable.spread)
    // {
    //     percent = (time - seasonTable.dawnTime) / seasonTable.spread;
    //     from = seasonTable.dawn;
    //     to = seasonTable.day;
    // }
    // else if (time < seasonTable.duskTime - seasonTable.spread)
    // {
    //     from = seasonTable.day;
    //     to = from;
    // }
    // else if (time < seasonTable.duskTime)
    // {
    //     percent = 1 - (seasonTable.duskTime - time) / seasonTable.spread;
    //     from = seasonTable.day;
    //     to = seasonTable.dusk;
    // }
    // else if (time < seasonTable.duskTime + seasonTable.spread)
    // {
    //     percent = (time - seasonTable.duskTime) / seasonTable.spread;
    //     from = seasonTable.dusk;
    //     to = seasonTable.night;
    // }
    // else
    // {
    //     from = seasonTable.night;
    //     to = from;
    // }

    RGB.r = Vector3.lerp(new Vector3(from.r[0], from.r[1], from.r[2]),
                         new Vector3(to.r[0], to.r[1], to.r[2]), percent);
    RGB.g = Vector3.lerp(new Vector3(from.g[0], from.g[1], from.g[2]),
                         new Vector3(to.g[0], to.g[1], to.g[2]), percent);
    RGB.b = Vector3.lerp(new Vector3(from.b[0], from.b[1], from.b[2]),
                         new Vector3(to.b[0], to.b[1], to.b[2]), percent);
}
