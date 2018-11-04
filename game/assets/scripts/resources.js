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
    SpriteBatch.drawText(font, "Seeds: " + ResourceData.seeds, new Vector2(0, 50), new Vector2(), new Color());
    SpriteBatch.drawText(font, "Biomass: " + ResourceData.biomass, new Vector2(0, 65), new Vector2(), new Color());
}