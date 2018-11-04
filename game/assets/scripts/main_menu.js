var MainMenuData = {
    isDisplaying: true,
    isGameOver: false,
    gameOverShownForS: 0,
};

var titleTexture = getTexture("title.png");

function main_menu_render()
{
    Renderer.pushRenderTarget(worldRT);
    Renderer.clear(new Color(1, 0, 0.5));

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
    Renderer.setBlendMode(BlendMode.ADD);
    SpriteBatch.drawSprite(titleTexture, scaledRes.mul(new Vector2(0.5, .5)).add(new Vector2(0, 15)));
    SpriteBatch.drawText(font, "Press Enter", new Vector2((scaledRes.x / 2) - (font.measure("Press Enter").x / 2), scaledRes.y * .7), new Color());
    SpriteBatch.end();


    PrimitiveBatch.begin(PrimitiveMode.TRIANGLE_LIST, null, Matrix.createScale(scale * 3));
    Renderer.setBlendMode(BlendMode.ADD);

    var t = 1;
    for (var i = 0; i < sunRays.length; ++i)
    {
        var sunRay = sunRays[i];
        var percent = sunRay.progress / (RAYS_TIME / 2);
        if (percent > 1) percent = 1 - (percent - 1);
        var leftCol = percent * RAYS_INTENSITY * t;
        var rightCol = percent * RAYS_INTENSITY * t;
        var leftColor = new Color(0, leftCol, 0, leftCol);
        var rightColor = new Color(0, rightCol, 0, rightCol);
        var x = sunRay.xPos + sunRay.xOffset + scaledRes.x / 3 / 2;
        var y = sunRay.yPos + 32 + scaledRes.y / 3 / 2;

        PrimitiveBatch.draw(new Vector2(x, y), leftColor.mul(0.25));
        PrimitiveBatch.draw(new Vector2(x + 16, y), rightColor.mul(0.25));
        PrimitiveBatch.draw(new Vector2(x + 32, y - 64), rightColor);

        PrimitiveBatch.draw(new Vector2(x, y), leftColor.mul(0.25));
        PrimitiveBatch.draw(new Vector2(x + 32, y - 64), rightColor);
        PrimitiveBatch.draw(new Vector2(x + 32 - 16, y - 64), leftColor);
    }

    PrimitiveBatch.end();

    Renderer.popRenderTarget();

    // Menu post process shit
    var screenRect = new Rect(0, 0, resolution.x, resolution.y);

    worldRT.sepia();
    worldRT.vignette(1);
    worldRT.crt();
    // screenRT.sepia();

    Renderer.pushRenderTarget(bloomRT);
    bloomSelectShader.setNumber("select", 0.25);
    SpriteBatch.begin(Matrix.IDENTITY, bloomSelectShader);
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(worldRT, screenRect);
    SpriteBatch.end();
    Renderer.popRenderTarget();
    bloomRT.sepia();
    bloomRT.blur(32);

    Renderer.clear(new Color(0, 0, 0));

    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.OPAQUE);
    SpriteBatch.drawRect(worldRT, screenRect);
    SpriteBatch.end();

    SpriteBatch.begin();
    Renderer.setBlendMode(BlendMode.ADD);
    SpriteBatch.drawRect(bloomRT, screenRect, new Color(1));
    SpriteBatch.end();
}

function main_menu_update(dt)
{
    sunny_update(dt);
    if(input_is_activation_just_down())
    {
        playSound("levelup.wav");
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