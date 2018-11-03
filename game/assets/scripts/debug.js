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
        GUI.text(Math.floor(DayData.currentTimeSeconds / 60 / 60) + ":00");
        DayData.currentTimeSeconds = GUI.sliderNumber("Time of day", DayData.currentTimeSeconds, 0, 24 * 60 * 60);
    }
    GUI.end();
}
