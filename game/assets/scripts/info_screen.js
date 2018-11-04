
var InfoScreenConstants = {
    seedSprite: playSpriteAnim("icons.json", "seed"),
    sunSprite: playSpriteAnim("icons.json", "sun"),
    waterSprite: playSpriteAnim("icons.json", "water"),
    bioSprite: playSpriteAnim("icons.json", "bio"),
    skullSprite: playSpriteAnim("icons.json", "skull"),
    fastforwardSprite:playSpriteAnim("icons.json", "fastforward"),
    sunnySprite: playSpriteAnim("days.json", "sunny"),
    cloudySprite: playSpriteAnim("days.json", "cloudy"),
    rainySprite: playSpriteAnim("days.json", "rainy"),
    stormySprite: playSpriteAnim("days.json", "stormy"),
    snowySprite: playSpriteAnim("days.json", "snowy"),
    waterBarSprite: playSpriteAnim("bars.json", "water4"),
    sunBarSprite: playSpriteAnim("bars.json", "sun4"),
    iceageTexture: getTexture("iceage.png")

}

InfoScreenConstants.fastforwardSprite.setSpeed(0);

function info_screen_render()
{
    Renderer.clear(new Color(0, 0, 0));
    worldShader.setVector4("red", new Vector4(0.121, 0.848, 0.969, 1.0))
    worldShader.setVector4("green", new Vector4(0.883, 0.625, 0.998, 1))
    worldShader.setVector4("blue", new Vector4(0.125, 0.199, 0.129, 1)) 
    SpriteBatch.begin(Matrix.createScale(2), worldShader);
    var textSize = font.measure("Text");
    var yPosition = textSize.y;
    SpriteBatch.drawText(font, "Objective", new Vector2(0, yPosition));
    yPosition += textSize.y;
    SpriteBatch.drawText(font, "Grow plants and obtain enough seeds to survive through the impending ice age.", new Vector2(0, yPosition));
    yPosition += (textSize.y * 1.5);
    SpriteBatch.drawText(font, "Controls", new Vector2(0, yPosition));
    yPosition += textSize.y;
    SpriteBatch.drawText(font, "Move between plants with A/Left Arrow and D/Right Arrow. ", new Vector2(0, yPosition));
    yPosition += textSize.y;
    SpriteBatch.drawText(font, "Open the interacation menu by holding Space/Enter. Select an option by holding W,A,S,D or Up, Down, Left, Right arrows.", new Vector2(0, yPosition));
    yPosition += textSize.y;
    SpriteBatch.drawText(font, "Release to confirm the selection. ", new Vector2(0, yPosition));
    yPosition += (textSize.y * 1.5);
    SpriteBatch.drawText(font, "Interface", new Vector2(0, yPosition));
    yPosition += 20;
    var yPositionStartIcons = yPosition;
    var xPosIcon = 10;
    var XPosText = 18;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.seedSprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Seed plant. Provides seeds needed to grow plants from fertile ground.", new Vector2(XPosText, yPosition));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.sunSprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Sun plant. Absorbs extra sun. Radiates lights to plants when it is dark.", new Vector2(XPosText, yPosition));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.waterSprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Water plant. Holds extra water. Provides excess water to other plants.", new Vector2(XPosText, yPosition));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.bioSprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Biomass plant. Provides biomass needed to level up plants.", new Vector2(XPosText, yPosition));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.skullSprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Dead plant. The plant must be destroyed to create fertile ground.", new Vector2(XPosText, yPosition));
    yPosition += 10;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.sunBarSprite, new Vector2(xPosIcon + 10, yPosition));
    SpriteBatch.drawText(font, "Sun meter. Displays available sun for a plant.", new Vector2(XPosText, yPosition + 25));
    yPosition += 35;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.waterBarSprite, new Vector2(xPosIcon + 10, yPosition));
    SpriteBatch.drawText(font, "Water meter. Displays available water for a plant.", new Vector2(XPosText, yPosition + 20));

    xPosIcon = 390;
    XPosText = 417;
    yPosition = yPositionStartIcons;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.sunnySprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Sunny day. Provide sun, no water.", new Vector2(XPosText, yPosition + 3));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.cloudySprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Cloudy day. Provides some sun, no water.", new Vector2(XPosText, yPosition + 3));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.rainySprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Rainy day. Provides some sun, water.", new Vector2(XPosText, yPosition + 3));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.stormySprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Stormy day. Provides no sun, water.", new Vector2(XPosText, yPosition + 3));
    yPosition += 20;
    SpriteBatch.drawSpriteAnim(InfoScreenConstants.snowySprite, new Vector2(xPosIcon, yPosition));
    SpriteBatch.drawText(font, "Sun meter. Provides some sun, water.", new Vector2(XPosText, yPosition + 3));
    yPosition += 20;
    SpriteBatch.drawSprite(InfoScreenConstants.iceageTexture, new Vector2(xPosIcon + 16, yPosition + 10));
    SpriteBatch.drawText(font, "Ice age meter.", new Vector2(XPosText + 7, yPosition + 8));
    yPosition += 23;
    SpriteBatch.drawText(font, "Displays the time before the next ice age.", new Vector2(XPosText + 7, yPosition));
    SpriteBatch.end();
}