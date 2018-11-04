var MainMenuData = {
    isDisplaying: true
};

function main_menu_render()
{
    ;
    SpriteBatch.begin();
    SpriteBatch.drawText(font, "Press Enter", new Vector2((resolution.x / 2) - (font.measure("Press Enter").x / 2), resolution.y / 2), new Color());
    SpriteBatch.end();
}

function main_menu_update(dt)
{
    if(Input.isJustDown(Key.ENTER))
    {
        MainMenuData.isDisplaying = false;
    }
}