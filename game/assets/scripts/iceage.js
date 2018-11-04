function iceage_reset_data()
{
    return {
        daysToIceage: 50.0
    }
}

var IceageData = iceage_reset_data();

function iceage_update(dt)
{
    if(!MainMenuData.isDisplaying)
    {
        IceageData.daysToIceage -= (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;

        if(IceageData.daysToIceage < 0 && ResourceData.seeds < 100)
        {
            main_menu_show(true);
        }
    }
}