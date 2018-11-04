function iceage_reset_data()
{
    return {
        daysToIceage: 30.0,
        startingDaysToIceage: 30.0,
        seedsNeeded: 50,
        seedsNeededPerIceage: 50,
        seedsDifficultyIncrease: 15,
        iceageLevel: 0
    }
}

var IceageData = iceage_reset_data();

function iceage_update(dt)
{
    if(!MainMenuData.isDisplaying)
    {
        if(ResourcesData.seeds >= IceageData.seedsNeeded)
        {
            IceageData.iceageLevel++;

            IceageData.seedsNeeded += IceageData.seedsNeededPerIceage + IceageData.seedsDifficultyIncrease * IceageData.iceageLevel;
            IceageData.daysToIceage = IceageData.startingDaysToIceage;
        }
        else
        {
            IceageData.daysToIceage -= (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;

            if(IceageData.daysToIceage < 0 && ResourcesData.seeds < 50)
            {
                main_menu_show(true);
            }
        }
    }
}

function iceage_render()
{
    var xRenderPos = 0;
    var yRenderpos = 25;
    var renderWidth = 50;

    SpriteBatch.drawRect(null, new Rect(xRenderPos, yRenderpos + 4.0, renderWidth, 2.0), Color.WHITE);

    SpriteBatch.drawRect(null, new Rect(xRenderPos + (renderWidth - (renderWidth * (IceageData.daysToIceage / IceageData.startingDaysToIceage))), yRenderpos, 2.0, 10.0), Color.WHITE);
}
