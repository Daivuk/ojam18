var plants = [];

var PLANT_WATER_MAX = 100;
var PLANT_SUN_MAX = 100;
var PLANT_SEED_MAX = 100;
var PLANT_BIOMASS_MAX = 100;

var PLANT_MAX_LIFE_DAYS = 5.0;

// PD = Per Day

var PLANT_WATER_USAGE_PD = 50;
var PLANT_WATER_ABSORB_PD = 100;
var PLANT_WATER_LEECH_PD = 50;

var PLANT_SUN_USAGE_PD = 50;
var PLANT_SUN_ABSORB_PD = 100;
var PLANT_SUN_BONUS_PD = 25;

var PLANT_SEED_PROGRESS_PD = 50;
var PLANT_BIOMASS_PROGRESS_PD = 100;

var PlantType = {
    NORMAL: "normal",
    WATER: "water",
    SOLAR: "solar",
    SEED: "seed"
}

var PlantData = {
    globalId: 0
}

var PlantMenuData = {
    menuSprite: playSpriteAnim("plant_ui.json", "center"),
    menuAborted: false,
    action: "none",
    activeMenuPosition: null
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
        biomass: 0,
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

    _plant.age += (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;

    if(_plant.age > PLANT_MAX_LIFE_DAYS)
    {
        _plant.dead = true;
    }
}

function plants_update(dt)
{
    var waterLeeches = [];
    var surplusWaterPlants = [];

    var sunLeeches = [];
    var sunPlantBonus = 0;

    for(var i = 0; i < plants.length; ++i)
    {
        plant_age(plants[i], (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor);

        if(!plants[i].dead)
        {
            // Seed
            if(plants[i].type == PlantType.SEED && plants[i].seed < PLANT_SEED_MAX)
            {
                plants[i].seed += PLANT_SEED_PROGRESS_PD * (plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].seed = Math.min(plants[i].seed, PLANT_SEED_MAX);
            }

            // Biomass
            if(plants[i].type == PlantType.NORMAL && plants[i].biomass < PLANT_BIOMASS_MAX)
            {
                plants[i].biomass += PLANT_BIOMASS_PROGRESS_PD * (plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].biomass = Math.min(plants[i].biomass, PLANT_BIOMASS_MAX);
            }

            // Water
            if(plants[i].type == PlantType.WATER && plants[i].level > 0)
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, (plants[i].level + 1) * PLANT_WATER_MAX);
            }
            else
            {
                plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plants[i].water = Math.min(plants[i].water, PLANT_WATER_MAX);
            }

            // Sunlight
            plants[i].sun += PLANT_SUN_ABSORB_PD * day_getLightLevel() * weather_getSunMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            plants[i].sun -= PLANT_SUN_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            plants[i].sun = Math.min(plants[i].sun, PLANT_SUN_MAX);

            // Find all the water and sun plants to apply their global effects
            if(plants[i].sun <= 0 || plants[i].water <= 0)
            {
                plants[i].dead = true;
            }
            else
            {
                if(plants[i].type == PlantType.WATER && plants[i].water > PLANT_WATER_MAX)
                {
                    surplusWaterPlants.push(plants[i]);
                }

                if(plants[i].water < PLANT_WATER_MAX)
                {
                    waterLeeches.push(plants[i]);
                }

                if(plants[i].type == PlantType.SOLAR && plants[i].level > 0)
                {
                    sunPlantBonus += plants[i].level * PLANT_SUN_BONUS_PD;
                }

                if(plants[i].sun < PLANT_SUN_MAX)
                {
                    // Sun plants also benefit from their own sun bonus
                    sunLeeches.push(plants[i]);
                }
            }
        }
    }

    // Apply water plant bonus
    if(surplusWaterPlants.length > 0 && waterLeeches.length > 0)
    {
        var leechAmount = (waterLeeches.length * PLANT_WATER_LEECH_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor) / surplusWaterPlants.length;

        for(var i = 0; i < surplusWaterPlants.length; ++i)
        {
            surplusWaterPlants[i].water -= leechAmount;
        }

        for(var i = 0; i < waterLeeches.length; ++i)
        {
            waterLeeches[i].water += PLANT_WATER_LEECH_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            waterLeeches[i].water = Math.min(waterLeeches[i].water, PLANT_WATER_MAX);
        }
    }

    // Apply sun plant bonus
    if(sunPlantBonus > 0 && sunLeeches.length > 0)
    {
        var leechAmount = (sunPlantBonus * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor) / sunLeeches.length;

        for(var i = 0; i < sunLeeches.length; ++i)
        {
            sunLeeches[i].sun += leechAmount;
            sunLeeches[i].sun = Math.min(sunLeeches[i].sun, PLANT_SUN_MAX);
        }
    }

    var handled = false;

    if ((Input.isJustDown(Key.SPACE_BAR) || GamePad.isJustDown(0, Button.A)) && focus_is_plant_type(FocusData.focusItems[FocusData.currentFocusItemIndex].type))
    {
        var focusItem = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData;

        if(focusItem.seed == PLANT_SEED_MAX)
        {
            handled = true;
            seeds++;
            focusItem.seed = 0;
        }

        if(focusItem.biomass == PLANT_BIOMASS_MAX)
        {
            handled = true;
            biomass++;
            focusItem.biomass = 0;
        }
    }

    if(!handled)
    {
        var currentFocusItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
        if (focus_is_plant_type(currentFocusItem.type))
        {
            if (Input.isDown(Key.SPACE_BAR) || GamePad.isDown(0, Button.A))
            {
                PlantMenuData.activeMenuPosition = currentFocusItem.itemData.position;
                if (Input.isDown(Key.UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP) && PlantMenuData.action != "level")
                {
                    PlantMenuData.menuSprite.play("up");
                    PlantMenuData.action = "level";
                }
                else if (Input.isDown(Key.DOWN) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN) && PlantMenuData.action != "destroy")
                {
                    PlantMenuData.menuSprite.play("bottom");
                    PlantMenuData.action = "destroy";
                }

                if (!PlantMenuData.menuAborted && (Input.isJustUp(Key.UP) || Input.isJustUp(Key.DOWN) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN)))
                {
                    PlantMenuData.menuSprite.play("center");
                    PlantMenuData.menuAborted = true;
                }
            }
            else
            {
                PlantMenuData.activeMenuPosition = null;
            }

            if (PlantMenuData.menuAborted && !PlantMenuData.menuSprite.isPlaying())
            {
                PlantMenuData.menuAborted = false;
                PlantMenuData.action = "none";
            }

            if(PlantMenuData.action == "level" && (Input.isJustUp(Key.SPACE_BAR) || GamePad.isJustUp(0, Button.A)) && biomass > 0)
            {
                if(currentFocusItem.itemData.level < 3)
                {
                    currentFocusItem.itemData.level++;
                    biomass--;
                }

                PlantMenuData.action = "none";
            }
        }
        else
        {
            PlantMenuData.activeMenuPosition = null;
        }
    }
    else
    {
        PlantMenuData.activeMenuPosition = null;
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

        if(!plants[i].dead)
        {
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 8, -plants[i].water / 10, 2, plants[i].water / 10), new Color(0, 0, 1, 1));
            SpriteBatch.drawRect(null, new Rect(plants[i].position - 11, -plants[i].sun / 10, 2, plants[i].sun / 10), new Color(0, 1, 0, 1));
        }

        if(plants[i].seed == PLANT_SEED_MAX || plants[i].biomass == PLANT_BIOMASS_MAX)
        {
            SpriteBatch.drawRect(null, new Rect(plants[i].position, -2, 2, 2), new Color(1, 1, 1, 1));
        }

        if (PlantMenuData.activeMenuPosition != null)
        {
            SpriteBatch.drawSpriteAnim(PlantMenuData.menuSprite, new Vector2(PlantMenuData.activeMenuPosition, -25));
        }
    }
}
