var ResourceConstants = {
    seedSprite: playSpriteAnim("icons.json", "seed"),
    biomassSprite: playSpriteAnim("icons.json", "bio")
}

function resources_reset_data()
{
    return {
        seeds: 1,
        biomass: 1,
        seedsBounceAnim: new NumberAnim(0),
        biomassBounceAnim: new NumberAnim(0)
    }
}

var ResourceData = resources_reset_data();

var ResourceDataSaveProperties = [
    "seeds",
    "biomass"
];

function resources_render()
{
    var resourcesBasePosition = new Vector2(10, resolution.y / 2 - 30);
    
    if (ResourceData.seeds > 0)
    {
        var seedsSpritePosition = new Vector2(resourcesBasePosition.x + ResourceData.seedsBounceAnim.get() * 8, resourcesBasePosition.y);
        SpriteBatch.drawInclinedRect(null, new Rect(0, seedsSpritePosition.y - 8, 38, 16), -0.3, new Color(0, 0, 0, .5));
        SpriteBatch.drawSpriteAnim(ResourceConstants.seedSprite, seedsSpritePosition);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourceData.seeds, new Vector2(seedsSpritePosition.x + 10, seedsSpritePosition.y), Vector2.LEFT, Color.WHITE,
            new Color(0, 0, 0, .5), 1);
    }

    if (ResourceData.biomass > 0)
    {
        var biomassSpritePosition = new Vector2(resourcesBasePosition.x + ResourceData.biomassBounceAnim.get() * 8, resourcesBasePosition.y + 20);
        SpriteBatch.drawInclinedRect(null, new Rect(0, biomassSpritePosition.y - 8, 38, 16), -0.3, new Color(0, 0, 0, .5));
        SpriteBatch.drawSpriteAnim(ResourceConstants.biomassSprite, biomassSpritePosition);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourceData.biomass, new Vector2(biomassSpritePosition.x + 10, biomassSpritePosition.y), Vector2.LEFT, Color.WHITE,
            new Color(0, 0, 0, .5), 1);
    }
}