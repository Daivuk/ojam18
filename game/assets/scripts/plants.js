var plants = [];

var PlantType = {
    WATER: 1,
    SOLAR: 2,
    SEED: 3
}

function plant_create(_position, _type)
{
    var plant = {
        type: _type,
        position: _position,
        progress: 0,
        level: 0
    };

    plants.push(plant);
}

function plant_progress(_plant, _amount)
{
    _plant.progress += _amount;

    while(_plant.progress >= (100 + _plant.level * 25))
    {
        _plant.progress -= 100 + _plant.level * 25;
        _plant.level++;
    }
}

function plants_update(dt)
{
}

function plants_render()
{
    for(var i = 0; i < plants.length; ++i)
    {
        var height = 100.0 * (plants[i].level + 1);
        var width = 10.0 * (plants[i].level + 1);
        SpriteBatch.drawRect(null, new Rect(plants[i].position - width * 0.5, 0.0, width, -height), new Color(0, 1, 1, 1));
    }
}
