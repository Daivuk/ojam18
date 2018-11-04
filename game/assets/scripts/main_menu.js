var MainMenuData = {
    isDisplaying: true
};

var titleTexture = getTexture("title.png");

function main_menu_render()
{
    var scale = resolution.y / 240;
    var scaledRes = new Vector2(resolution.x / scale, resolution.y / scale);
    SpriteBatch.begin(Matrix.createScale(scale));
    SpriteBatch.drawSprite(titleTexture, scaledRes.mul(new Vector2(0.5, .5)));
    SpriteBatch.drawText(font, "Press Enter", new Vector2((scaledRes.x / 2) - (font.measure("Press Enter").x / 2), scaledRes.y * .7), new Color());
    SpriteBatch.end();
}

function main_menu_update(dt)
{
    if(Input.isJustDown(Key.ENTER))
    {
        MainMenuData.isDisplaying = false;
    }
}