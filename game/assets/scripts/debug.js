var showDebug = false;

function debug_update(dt)
{
    if (Input.isJustDown(Key.TAB))
    {
        showDebug = !showDebug;
    }
}

function debug_renderUI()
{
    if (!showDebug) return;
    
    if (GUI.begin("Debug Menu"))
    {
        if (GUI.button("save palette"))
        {
            var file = new BinaryFileWriter("hsv.json");
            file.writeString(JSON.stringify(rgbTable));
        }
        GUI.text(Math.floor(DayData.currentTimeSeconds / 60 / 60) + ":00");
        DayData.currentTimeSeconds = GUI.sliderNumber("Time of day", DayData.currentTimeSeconds, 0, 24 * 60 * 60);
        DayData.timeScaleFactor = GUI.sliderNumber("Time Scale Factor", DayData.timeScaleFactor, 0, 35000);

        SeasonData.currentMonth = GUI.radioButton("Winter", SeasonData.currentMonth, MonthConstants.january);
        SeasonData.currentMonth = GUI.radioButton("Spring", SeasonData.currentMonth, MonthConstants.april);
        SeasonData.currentMonth = GUI.radioButton("Summer", SeasonData.currentMonth, MonthConstants.july);
        SeasonData.currentMonth = GUI.radioButton("Fall", SeasonData.currentMonth, MonthConstants.october);

        var seasonTable = rgbTable[SeasonConstants.seasons[season_get_current_season_index()]];

        if (GUI.button("night")) DayData.currentTimeSeconds = 0;
        GUI.sameLine();
        if (GUI.button("dawn")) DayData.currentTimeSeconds = seasonTable.dawnTime * 60 * 60;
        GUI.sameLine();
        if (GUI.button("day")) DayData.currentTimeSeconds = 12 * 60 * 60;
        GUI.sameLine();
        if (GUI.button("dusk")) DayData.currentTimeSeconds = seasonTable.duskTime * 60 * 60;

        if (GUI.button("sunny")) WeatherData.activeWeathers[0] = WeatherConstants.sunny;
        GUI.sameLine();
        if (GUI.button("cloudy")) WeatherData.activeWeathers[0] = WeatherConstants.cloudy;
        GUI.sameLine();
        if (GUI.button("rainy")) WeatherData.activeWeathers[0] = WeatherConstants.rainy;
        GUI.sameLine();
        if (GUI.button("stormy")) WeatherData.activeWeathers[0] = WeatherConstants.stormy;
        GUI.sameLine();
        if (GUI.button("snowy")) WeatherData.activeWeathers[0] = WeatherConstants.snowy;

        seasonTable.bloomSelect = GUI.dragNumber("Bloom Select", seasonTable.bloomSelect, .01, 0, 1);
        seasonTable.bloomAmount = GUI.dragNumber("Bloom Amount", seasonTable.bloomAmount, .01, 0, 1);
        seasonTable.bloomSelectN = GUI.dragNumber("Bloom Select Night", seasonTable.bloomSelectN, .01, 0, 1);
        seasonTable.bloomAmountN = GUI.dragNumber("Bloom Amount Night", seasonTable.bloomAmountN, .01, 0, 1);

        var ret;
        if (GUI.collapsingHeader("Night"))
        {
            ret = GUI.colorPickerRGBA("Red##Night", new Color(seasonTable.night.r[0], seasonTable.night.r[1], seasonTable.night.r[2], 1));
            seasonTable.night.r[0] = ret.r;
            seasonTable.night.r[1] = ret.g;
            seasonTable.night.r[2] = ret.b;
            ret = GUI.colorPickerRGBA("Green##Night", new Color(seasonTable.night.g[0], seasonTable.night.g[1], seasonTable.night.g[2], 1));
            seasonTable.night.g[0] = ret.r;
            seasonTable.night.g[1] = ret.g;
            seasonTable.night.g[2] = ret.b;
            ret = GUI.colorPickerRGBA("Blue##Night", new Color(seasonTable.night.b[0], seasonTable.night.b[1], seasonTable.night.b[2], 1));
            seasonTable.night.b[0] = ret.r;
            seasonTable.night.b[1] = ret.g;
            seasonTable.night.b[2] = ret.b;
        }
        if (GUI.collapsingHeader("Dawn"))
        {
            ret = GUI.colorPickerRGBA("Red##Dawn", new Color(seasonTable.dawn.r[0], seasonTable.dawn.r[1], seasonTable.dawn.r[2], 1));
            seasonTable.dawn.r[0] = ret.r;
            seasonTable.dawn.r[1] = ret.g;
            seasonTable.dawn.r[2] = ret.b;
            ret = GUI.colorPickerRGBA("Green##Dawn", new Color(seasonTable.dawn.g[0], seasonTable.dawn.g[1], seasonTable.dawn.g[2], 1));
            seasonTable.dawn.g[0] = ret.r;
            seasonTable.dawn.g[1] = ret.g;
            seasonTable.dawn.g[2] = ret.b;
            ret = GUI.colorPickerRGBA("Blue##Dawn", new Color(seasonTable.dawn.b[0], seasonTable.dawn.b[1], seasonTable.dawn.b[2], 1));
            seasonTable.dawn.b[0] = ret.r;
            seasonTable.dawn.b[1] = ret.g;
            seasonTable.dawn.b[2] = ret.b;
        }
        if (GUI.collapsingHeader("Day"))
        {
            ret = GUI.colorPickerRGBA("Red##Day", new Color(seasonTable.day.r[0], seasonTable.day.r[1], seasonTable.day.r[2], 1));
            seasonTable.day.r[0] = ret.r;
            seasonTable.day.r[1] = ret.g;
            seasonTable.day.r[2] = ret.b;
            ret = GUI.colorPickerRGBA("Green##Day", new Color(seasonTable.day.g[0], seasonTable.day.g[1], seasonTable.day.g[2], 1));
            seasonTable.day.g[0] = ret.r;
            seasonTable.day.g[1] = ret.g;
            seasonTable.day.g[2] = ret.b;
            ret = GUI.colorPickerRGBA("Blue##Day", new Color(seasonTable.day.b[0], seasonTable.day.b[1], seasonTable.day.b[2], 1));
            seasonTable.day.b[0] = ret.r;
            seasonTable.day.b[1] = ret.g;
            seasonTable.day.b[2] = ret.b;
        }
        if (GUI.collapsingHeader("Dusk"))
        {
            ret = GUI.colorPickerRGBA("Red##Dusk", new Color(seasonTable.dusk.r[0], seasonTable.dusk.r[1], seasonTable.dusk.r[2], 1));
            seasonTable.dusk.r[0] = ret.r;
            seasonTable.dusk.r[1] = ret.g;
            seasonTable.dusk.r[2] = ret.b;
            ret = GUI.colorPickerRGBA("Green##Dusk", new Color(seasonTable.dusk.g[0], seasonTable.dusk.g[1], seasonTable.dusk.g[2], 1));
            seasonTable.dusk.g[0] = ret.r;
            seasonTable.dusk.g[1] = ret.g;
            seasonTable.dusk.g[2] = ret.b;
            ret = GUI.colorPickerRGBA("Blue##Dusk", new Color(seasonTable.dusk.b[0], seasonTable.dusk.b[1], seasonTable.dusk.b[2], 1));
            seasonTable.dusk.b[0] = ret.r;
            seasonTable.dusk.b[1] = ret.g;
            seasonTable.dusk.b[2] = ret.b;
        }

        if(GUI.button("Level Up"))
        {
            if(focus_is_plant_type(FocusData.focusItems[FocusData.currentFocusItemIndex].type))
            {
                var focusItem = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData;

                if(focusItem.level < 3)
                {
                    focusItem.level++;
                }
            }
        }
    }
    GUI.end();
}
