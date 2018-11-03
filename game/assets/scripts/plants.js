var plants = [];

var PLANT_DEATH_PROGRESS = 1000.0;
var PLANT_LEVEL_PROG_MULTIPLIER = 25;
var PLANT_BASE_LEVEL_PROG = 100;

// Progress needed to advance to next level is PLANT_BASE_LEVEL_PROG + currentLevel * PLANT_LEVEL_PROG_MULTIPLIER

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
    // Dead
    if(_plant.level < 4)
    {
        _plant.progress += _amount;
    }
    else
    {
        return;
    }
    
    // Growing
    if(_plant.level < 3)
    {
        while(_plant.progress >= (PLANT_BASE_LEVEL_PROG + _plant.level * PLANT_LEVEL_PROG_MULTIPLIER) && _plant.level < 3)
        {
            _plant.progress -= PLANT_BASE_LEVEL_PROG + _plant.level * PLANT_LEVEL_PROG_MULTIPLIER;
            _plant.level++;
        }
    }

    // Max level
    if(_plant.level == 3)
    {
        if(_plant.progress > PLANT_DEATH_PROGRESS)
        {
            _plant.level++;
        }
    }
}

function plants_update(dt)
{
    for(var i = 0; i < plants.length; ++i)
    {
        plant_progress(plants[i], dt * 20.0);
    }
}

function plants_render()
{
    for(var i = 0; i < plants.length; ++i)
    {
        var color = new Color(1, 1, 1, 1);

        if(plants[i].level == 4)
        {
            color = new Color(0.2, 0.2, 0.2, 1.0);
        }

        SpriteBatch.drawSpriteAnim(playSpriteAnim("tree.json", "water_level" + Math.min(plants[i].level, 3)), new Vector2(plants[i].position, 0.0), color);
    }
}
