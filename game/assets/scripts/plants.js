var plants = [];

var PLANT_DEATH_PROGRESS = 10000.0;
var PLANT_LEVEL_PROG_MULTIPLIER = 25;
var PLANT_BASE_LEVEL_PROG = 100;

var PLANT_WATER_AMOUNT = 100;
var PLANT_SUN_AMOUNT = 100;

// PD = Per Day

var PLANT_WATER_USAGE_PD = 50;
var PLANT_WATER_ABSORB_PD = 100;

var PLANT_SUN_USAGE_PD = 50;
var PLANT_SUN_ABSORB_PD = 100;

// Progress needed to advance to next level is PLANT_BASE_LEVEL_PROG + currentLevel * PLANT_LEVEL_PROG_MULTIPLIER

var PlantType = {
    NORMAL: "normal",
    WATER: "water",
    SOLAR: "solar",
    SEED: "seed"
}

var PlantData = {
    globalId: 0
}

function plant_create(_position, _type)
{
    var plant = {
        type: _type,
        position: _position,
        progress: 0,
        level: 0,
        water: 100,
        sun: 100,
        id: PlantData.globalId
    };

    plants.push(plant);
    focus_item_create(FocusConstants.plantTypeLevel0, PlantData.globalId, plant);

    PlantData.globalId++;
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

        if(plants[i].level < 4)
        {
            // Water
            if(plants[i].type == PlantType.WATER && plants[i].level > 0)
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * plants[i].level * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, plants[i].level * PLANT_WATER_AMOUNT);
            }
            else
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, PLANT_WATER_AMOUNT);
            }

            // Sunlight
            plants[i].sun += PLANT_SUN_ABSORB_PD * day_getLightLevel() * weather_getSunMultiplier() * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
            plants[i].sun -= PLANT_SUN_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
            plants[i].sun = Math.min(plants[i].sun, PLANT_SUN_AMOUNT);
        }
    }
}

function plants_render()
{
    for(var i = 0; i < plants.length; ++i)
    {
        var color = Color.WHITE;

        if(plants[i].level == 4)
        {
            color = new Color(0.2, 0.2, 0.2, 1.0);
        }

        SpriteBatch.drawSpriteAnim(playSpriteAnim("tree.json", plants[i].type + "_level" + Math.min(plants[i].level, 3)), new Vector2(plants[i].position, 0.0), color);

        /*if(plants[i].type == PlantType.WATER && plants[i].level < 4)
        {
            SpriteBatch.drawText(font, "" + Math.floor(plants[i].resources), new Vector2(plants[i].position, -10.0), Vector2.TOP_LEFT, new Color(0.0, 0.5, 1.0, 1.0));
        }*/

        if(plants[i].level < 4)
        {
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 8, -plants[i].water / 10, 2, plants[i].water / 10), new Color(0, 0, 1, 1));
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 11, -plants[i].sun / 10, 2, plants[i].sun / 10), new Color(0, 1, 0, 1));
        }
    }
}
