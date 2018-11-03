var seeds = 1;
var biomass = 1;

function resources_render()
{
    SpriteBatch.drawText(font, "Seeds: " + seeds, new Vector2(0, 50), new Vector2(), new Color());
    SpriteBatch.drawText(font, "Biomass: " + biomass, new Vector2(0, 65), new Vector2(), new Color());
}