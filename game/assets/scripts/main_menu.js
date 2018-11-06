var MainMenuData = {
    isDisplaying: true,
    isGameOver: false,
    gameOverShownForS: 0,
    infoScreenVisible: false
};

var titleTexture = getTexture("title.png");
var menuSkullSprite = playSpriteAnim("icons.json", "skull");

var menuSkullAnim = new NumberAnim(-1);
menuSkullAnim.playSingle(-1, 1, 1, Tween.EASE_BOTH, Loop.PING_PONG_LOOP);


function main_menu_render()
{
    if (uiFade < 1)
    {
        Renderer.pushRenderTarget(worldRT);
        Renderer.clear(new Color(0, 0, 0));

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

        SpriteBatch.begin(Matrix.createScale(scale).mul(Matrix.createTranslation(new Vector3(0, -(1 -(1 - uiFade) *(1 - uiFade)) * resolution.y / 3, 0))));
        Renderer.setBlendMode(BlendMode.ADD);
        SpriteBatch.drawSprite(titleTexture, scaledRes.mul(new Vector2(0.5, .5)).add(new Vector2(0, 15)));
        var textPosition = new Vector2((scaledRes.x / 2) - (font.measure(text).x / 2), scaledRes.y * .7);
        SpriteBatch.drawText(font, text, textPosition, new Color());
        if (MainMenuData.isGameOver)
        {
            SpriteBatch.drawSpriteAnim(menuSkullSprite, new Vector2((scaledRes.x / 2), textPosition.y + 30 + menuSkullAnim.get()));
        }
        else
        {
            SpriteBatch.drawText(font, "Hold Tab for Instructions", new Vector2(textPosition.x - 35, textPosition.y + 20), Vector2.TOP_LEFT, new Color(.8));
        }
        SpriteBatch.end();


        PrimitiveBatch.begin(PrimitiveMode.TRIANGLE_LIST, null, Matrix.createScale(scale * 3).mul(Matrix.createTranslation(new Vector3(0, -(1-(1 - uiFade) *(1 - uiFade)) * resolution.y / 4, 0))));
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
        // worldRT.crt();
        // screenRT.sepia();

        Renderer.pushRenderTarget(bloomRT);
        bloomSelectShader.setNumber("select", 0.25);
        SpriteBatch.begin(Matrix.IDENTITY, bloomSelectShader);
        Renderer.setBlendMode(BlendMode.OPAQUE);
        SpriteBatch.drawRect(worldRT, new Rect(0, 0, bloomRT.getSize().x, bloomRT.getSize().y));
        SpriteBatch.end();
        Renderer.popRenderTarget();
        bloomRT.sepia();
        bloomRT.blur(6.4);

        SpriteBatch.begin();
        Renderer.setBlendMode(BlendMode.OPAQUE);
        SpriteBatch.drawRect(worldRT, screenRect);
        SpriteBatch.end();

        SpriteBatch.begin();
        Renderer.setBlendMode(BlendMode.ADD);
        SpriteBatch.drawRect(bloomRT, screenRect, new Color(1));
        SpriteBatch.end();
    }

    if (uiFade > 0)
    {
        info_screen_render();
    }
}

function main_menu_update(dt)
{
    sunny_update(dt);
    if(input_is_activation_just_down())
    {
        playSound("pickup.wav", master_volume, 0, 1.5);
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
    if (MainMenuData.gameOverShownForS >= 5)
    {
        MainMenuData.gameOverShownForS = 0;
        MainMenuData.isGameOver = false;
    }

    if (Input.isDown(Key.TAB))
    {
        MainMenuData.infoScreenVisible = true;
        uiFade = Math.min(1, uiFade + dt);
    }
    else
    {
        MainMenuData.infoScreenVisible = false;
        uiFade = Math.max(0, uiFade - dt);
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