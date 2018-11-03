var plants = [];

var PLANT_WATER_MAX = 100;
var PLANT_SUN_MAX = 100;
var PLANT_SEED_MAX = 100;

var PLANT_MAX_LIFE_DAYS = 5.0;

// PD = Per Day

var PLANT_WATER_USAGE_PD = 50;
var PLANT_WATER_ABSORB_PD = 100;

var PLANT_SUN_USAGE_PD = 50;
var PLANT_SUN_ABSORB_PD = 100;

var PLANT_SEED_PROGRESS_PD = 50;

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
        age: 0,
        level: 0,
        water: 100,
        sun: 100,
        seed: 0,
        dead: false,
        id: PlantData.globalId
    };

    plants.push(plant);
    focus_item_create(FocusConstants.plantTypeLevel0, PlantData.globalId, plant);

    PlantData.globalId++;
}

function plant_age(_plant, _amount)
{
    // Dead
    if(_plant.dead || _plant.level < 3)
    {
        return;
    }

    if(_plant.age > PLANT_MAX_LIFE_DAYS)
    {
        _plant.dead = true;
    }
}

function plants_update(dt)
{
    for(var i = 0; i < plants.length; ++i)
    {
        plant_age(plants[i], (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor);

        if(!plants[i].dead)
        {
            // Seed
            if(plants[i].type == PlantType.SEED && plants[i].seed < PLANT_SEED_MAX)
            {
                plants[i].seed += PLANT_SEED_PROGRESS_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].seed = Math.min(plants[i].seed, PLANT_SEED_MAX);
            }

            // Water
            if(plants[i].type == PlantType.WATER && plants[i].level > 0)
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * plants[i].level * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, plants[i].level * PLANT_WATER_MAX);
            }
            else
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, PLANT_WATER_MAX);
            }

            // Sunlight
            plants[i].sun += PLANT_SUN_ABSORB_PD * day_getLightLevel() * weather_getSunMultiplier() * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
            plants[i].sun -= PLANT_SUN_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayConstants.timeScaleFactor;
            plants[i].sun = Math.min(plants[i].sun, PLANT_SUN_MAX);

            if(plants[i].sun <= 0 || plants[i].water <= 0)
            {
                plants[i].dead = true;
            }
        }
    }
}

function plants_render()
{
    for(var i = 0; i < plants.length; ++i)
    {
        var color = Color.WHITE;

        if(plants[i].dead)
        {
            color = new Color(0.2, 0.2, 0.2, 1.0);
        }

        SpriteBatch.drawSpriteAnim(playSpriteAnim("tree.json", plants[i].type + "_level" + Math.min(plants[i].level, 3)), new Vector2(plants[i].position, 0.0), color);

        /*if(plants[i].type == PlantType.WATER && plants[i].level < 4)
        {
            SpriteBatch.drawText(font, "" + Math.floor(plants[i].resources), new Vector2(plants[i].position, -10.0), Vector2.TOP_LEFT, new Color(0.0, 0.5, 1.0, 1.0));
        }*/

        if(!plants[i].dead)
        {
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 8, -plants[i].water / 10, 2, plants[i].water / 10), new Color(0, 0, 1, 1));
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 11, -plants[i].sun / 10, 2, plants[i].sun / 10), new Color(0, 1, 0, 1));
        }

        if(plants[i].seed == PLANT_SEED_MAX)
        {
            SpriteBatch.drawRect(null, new Rect(plants[i].position, -2, 2, 2), new Color(1, 1, 1, 1));
        }
    }
}
