var iceageTexture = getTexture("iceage.png");

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
    var invP = 1 - zoomFadePercent;
    invP *= invP;
    var xRenderPos = resolution.x - 32 * 2 - 2 + invP * 30;
    var yRenderPos = 50;
    var renderWidth = 56 - 2;

    SpriteBatch.drawSprite(iceageTexture, new Vector2(xRenderPos, yRenderPos), zoomFadeColor, 0, 2, Vector2.LEFT);

    var percent = (IceageData.daysToIceage / IceageData.startingDaysToIceage);
    SpriteBatch.drawRect(null, new Rect(4 + xRenderPos + (renderWidth - (renderWidth * percent)), yRenderPos - 4, 2.0, 10.0), zoomFadeColor);

    SpriteBatch.drawPrettyOutlinedText(font, "" + IceageData.seedsNeeded, new Vector2(xRenderPos + 30, yRenderPos - 19), Vector2.TOP_LEFT, zoomFadeColor, new Color(0, 0, 0, .5), 1);
}
