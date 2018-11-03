var plants = [];

function plant_create(_position)
{
    var plant = {
        position: _position,
        progress: 0,
        level: 1
    };

    plants.push(plant);
}

function plants_update(dt)
{
}

function plants_render()
{
    for(var i = 0; i < plants.length; ++i)
    {
        var height = 100.0 * plants[i].level;
        var width = 10.0 * plants[i].level;
        SpriteBatch.drawRect(null, new Rect(plants[i].position - width * 0.5, 0.0, width, -height), new Color(0, 1, 1, 1));
    }
}
