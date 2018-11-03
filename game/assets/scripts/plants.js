var plants = [];

var PlantType = {
    NORMAL: 1,
    WATER: 2,
    SOLAR: 3,
    SEED: 4
}

function plant_create(_position, _type)
{
    var plant = {
        type: _type,
        position: _position,
        progress: 0,
        level: 0,
        resources: 0
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
        SpriteBatch.drawSpriteAnim(playSpriteAnim("tree.json", "water_level" + plants[i].level), new Vector2(plants[i].position, 0.0));
    }
}
