var ResourcesConstants = {
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

var ResourcesData = resources_reset_data();

var ResourcesDataSaveProperties = [
    "seeds",
    "biomass"
];

function resources_render()
{
    var resourcesBasePosition = new Vector2(10, 45);
    
    if (ResourcesData.seeds > 0)
    {
        var seedsSpritePosition = new Vector2(resourcesBasePosition.x + ResourcesData.seedsBounceAnim.get() * 8, resourcesBasePosition.y);
        SpriteBatch.drawInclinedRect(null, new Rect(0, seedsSpritePosition.y - 8, 38, 16), -0.3, new Color(0, 0, 0, .5));
        SpriteBatch.drawSpriteAnim(ResourcesConstants.seedSprite, seedsSpritePosition);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourcesData.seeds, new Vector2(seedsSpritePosition.x + 10, seedsSpritePosition.y), Vector2.LEFT, Color.WHITE,
            new Color(0, 0, 0, .5), 1);
    }

    if (ResourcesData.biomass > 0)
    {
        var biomassSpritePosition = new Vector2(resourcesBasePosition.x + ResourcesData.biomassBounceAnim.get() * 8, resourcesBasePosition.y + 20);
        SpriteBatch.drawInclinedRect(null, new Rect(0, biomassSpritePosition.y - 8, 38, 16), -0.3, new Color(0, 0, 0, .5));
        SpriteBatch.drawSpriteAnim(ResourcesConstants.biomassSprite, biomassSpritePosition);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourcesData.biomass, new Vector2(biomassSpritePosition.x + 10, biomassSpritePosition.y), Vector2.LEFT, Color.WHITE,
            new Color(0, 0, 0, .5), 1);
    }
}