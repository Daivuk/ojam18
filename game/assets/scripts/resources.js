var ResourceConstants = {
    seedSprite: playSpriteAnim("icons.json", "seed"),
    biomassSprite: playSpriteAnim("icons.json", "bio")
}

var ResourceData = {
    seeds: 1,
    biomass: 1
}

var ResourceDataSaveProperties = [
    "seeds",
    "biomass"
];

function resources_render()
{
    var resourcesBasePosition = new Vector2(resolution.x - 20, 10);
    var seedsSpritePosition = new Vector2(resourcesBasePosition.x - 10, resourcesBasePosition.y);
    var biomassSpritePosition = new Vector2(resourcesBasePosition.x + 10, resourcesBasePosition.y);
    SpriteBatch.drawSpriteAnim(ResourceConstants.seedSprite, seedsSpritePosition);
    SpriteBatch.drawSpriteAnim(ResourceConstants.biomassSprite, biomassSpritePosition);
    SpriteBatch.drawText(font, "" + ResourceData.seeds, new Vector2(seedsSpritePosition.x, seedsSpritePosition.y + 5), new Vector2(), new Color());
    SpriteBatch.drawText(font, "" + ResourceData.biomass, new Vector2(biomassSpritePosition.x, biomassSpritePosition.y + 5), new Vector2(), new Color());
}