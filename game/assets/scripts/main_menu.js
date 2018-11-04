var MainMenuData = {
    isDisplaying: true,
    isGameOver: false,
    gameOverShownForS: 0,
};

var titleTexture = getTexture("title.png");

function main_menu_render()
{
    var scale = resolution.y / 240;
    var scaledRes = new Vector2(resolution.x / scale, resolution.y / scale);
    var text;
    if (MainMenuData.isGameOver)
    {
        text = "Game Over";
    }
    else
    {
        text = "Press Enter";
    }

    SpriteBatch.begin(Matrix.createScale(scale));
    SpriteBatch.drawSprite(titleTexture, scaledRes.mul(new Vector2(0.5, .5)));
    SpriteBatch.drawText(font, text, new Vector2((scaledRes.x / 2) - (font.measure("Press Enter").x / 2), scaledRes.y * .7), new Color());
    SpriteBatch.end();
}

function main_menu_update(dt)
{
    if(Input.isJustDown(Key.ENTER))
    {
        if (MainMenuData.isGameOver)
        {
            MainMenuData.gameOverShownForS = 0;
            MainMenuData.isGameOver = false;
        }
        else
        {
            MainMenuData.isDisplaying = false;
        }
    }

    MainMenuData.gameOverShownForS += dt;
    if (MainMenuData.gameOverShownForS >= 2)
    {
        MainMenuData.gameOverShownForS = 0;
        MainMenuData.isGameOver = false;
    }
}

function main_menu_show(isGameOver)
{
    MainMenuData.isGameOver = isGameOver;
    MainMenuData.isDisplaying = true;
    if (isGameOver)
    {
        reset_game();
    }
}