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
    plants : [],
    globalId: 0,
    dtMsSinceLastConsume: 0
}

var PlantDataSaveProperties = [
    "plants",
    "globalId"
];

var PlantMenuData = {
    menuSprite: playSpriteAnim("plant_ui.json", "center"),
    menuAborted: false,
    action: "none",
    activeMenuPosition: null,
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

    PlantData.plants.push(plant);
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

    _plant.age += _amount;

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

    for(var i = 0; i < PlantData.plants.length; ++i)
    {
        plant_age(PlantData.plants[i], (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor);

        if(!PlantData.plants[i].dead)
        {
            // Seed
            if(PlantData.plants[i].type == PlantType.SEED && PlantData.plants[i].seed < PLANT_SEED_MAX)
            {
                PlantData.plants[i].seed += PLANT_SEED_PROGRESS_PD * (PlantData.plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].seed = Math.min(PlantData.plants[i].seed, PLANT_SEED_MAX);
            }

            // Biomass
            if(PlantData.plants[i].type == PlantType.NORMAL && PlantData.plants[i].biomass < PLANT_BIOMASS_MAX)
            {
                PlantData.plants[i].biomass += PLANT_BIOMASS_PROGRESS_PD * (PlantData.plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].biomass = Math.min(PlantData.plants[i].biomass, PLANT_BIOMASS_MAX);
            }

            // Water
            if(PlantData.plants[i].type == PlantType.WATER && PlantData.plants[i].level > 0)
            {
                PlantData.plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (PlantData.plants[i].level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].water = Math.min(PlantData.plants[i].water, (PlantData.plants[i].level + 1) * PLANT_WATER_MAX);
            }
            else
            {
                PlantData.plants[i].water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                PlantData.plants[i].water = Math.min(PlantData.plants[i].water, PLANT_WATER_MAX);
            }

            // Sunlight
            PlantData.plants[i].sun += PLANT_SUN_ABSORB_PD * day_getLightLevel() * weather_getSunMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            PlantData.plants[i].sun -= PLANT_SUN_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            PlantData.plants[i].sun = Math.min(PlantData.plants[i].sun, PLANT_SUN_MAX);

            // Find all the water and sun plants to apply their global effects
            if(PlantData.plants[i].sun <= 0 || PlantData.plants[i].water <= 0)
            {
                PlantData.plants[i].dead = true;
            }
            else
            {
                if(PlantData.plants[i].type == PlantType.WATER && PlantData.plants[i].water > PLANT_WATER_MAX)
                {
                    surplusWaterPlants.push(PlantData.plants[i]);
                }

                if(PlantData.plants[i].water < PLANT_WATER_MAX)
                {
                    waterLeeches.push(PlantData.plants[i]);
                }

                if(PlantData.plants[i].type == PlantType.SOLAR && PlantData.plants[i].level > 0)
                {
                    sunPlantBonus += PlantData.plants[i].level * PLANT_SUN_BONUS_PD;
                }

                if(PlantData.plants[i].sun < PLANT_SUN_MAX)
                {
                    // Sun plants also benefit from their own sun bonus
                    sunLeeches.push(PlantData.plants[i]);
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
    var updateMsSinceLastConsume = true;
    // Consume dropped resource
    if ((Input.isJustDown(Key.SPACE_BAR) || GamePad.isJustDown(0, Button.A)) && focus_is_plant_type(FocusData.focusItems[FocusData.currentFocusItemIndex].type))
    {
        var focusItem = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData;

        if(focusItem.seed == PLANT_SEED_MAX)
        {
            updateMsSinceLastConsume = false;
            handled = true;
            ResourceData.seeds++;
            focusItem.seed = 0;
            PlantData.dtMsSinceLastConsume = 0;
        }

        if(focusItem.biomass == PLANT_BIOMASS_MAX)
        {
            updateMsSinceLastConsume = false;
            handled = true;
            ResourceData.biomass++;
            focusItem.biomass = 0;
            PlantData.dtMsSinceLastConsume = 0;
        }
    }
    
    if (updateMsSinceLastConsume)
    {
        PlantData.dtMsSinceLastConsume += dt * 1000;
    }


    // Handle pop-up menu
    if(!handled && PlantData.dtMsSinceLastConsume > 150)
    {
        var currentFocusItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
        if (focus_is_plant_type(currentFocusItem.type))
        {
            if (Input.isDown(Key.SPACE_BAR) || GamePad.isDown(0, Button.A))
            {
                PlantMenuData.activeMenuPosition = currentFocusItem.itemData.position;
                if ((Input.isDown(Key.UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP)) && PlantMenuData.action != "level")
                {
                    PlantMenuData.menuSprite.play("up");
                    PlantMenuData.action = "level";
                }
                else if ((Input.isDown(Key.DOWN) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN)) && PlantMenuData.action != "destroy")
                {
                    PlantMenuData.menuSprite.play("bottom");
                    PlantMenuData.action = "destroy";
                }

                if (!PlantMenuData.menuAborted && (Input.isJustUp(Key.UP) || Input.isJustUp(Key.DOWN) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN)))
                {
                    PlantMenuData.menuSprite.play("center");
                    PlantMenuData.menuAborted = true;
                }
                
                zoomFast = 1;
                zoomTargetOffset = 2;
            }
            else
            {
                PlantMenuData.activeMenuPosition = null;
                zoomTargetOffset = 0;
            }

            if (PlantMenuData.menuAborted && !PlantMenuData.menuSprite.isPlaying())
            {
                PlantMenuData.menuAborted = false;
                PlantMenuData.action = "none";
            }

            if(PlantMenuData.action == "level" && (Input.isJustUp(Key.SPACE_BAR) || GamePad.isJustUp(0, Button.A)) && ResourceData.biomass > 0)
            {
                if(currentFocusItem.itemData.level < 3)
                {
                    currentFocusItem.itemData.level++;
                    ResourceData.biomass--;
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
    for(var i = 0; i < PlantData.plants.length; ++i)
    {
        var color = Color.WHITE;

        if(PlantData.plants[i].dead)
        {
            color = new Color(0.2, 0.2, 0.2, 1.0);
        }

        SpriteBatch.drawSpriteAnim(playSpriteAnim("tree.json", PlantData.plants[i].type + "_level" + Math.min(PlantData.plants[i].level, 3)), new Vector2(PlantData.plants[i].position, 0.0), color);

        if(!PlantData.plants[i].dead)
        {
            SpriteBatch.drawRect(null, new Rect(PlantData.plants[i].position - 8, -PlantData.plants[i].water / 10, 2, PlantData.plants[i].water / 10), new Color(0, 0, 1, 1));
            SpriteBatch.drawRect(null, new Rect(PlantData.plants[i].position - 11, -PlantData.plants[i].sun / 10, 2, PlantData.plants[i].sun / 10), new Color(0, 1, 0, 1));
        }

        if(PlantData.plants[i].seed == PLANT_SEED_MAX || PlantData.plants[i].biomass == PLANT_BIOMASS_MAX)
        {
            SpriteBatch.drawRect(null, new Rect(PlantData.plants[i].position, -2, 2, 2), new Color(1, 1, 1, 1));
        }

        if (PlantMenuData.activeMenuPosition != null)
        {
            SpriteBatch.drawSpriteAnim(PlantMenuData.menuSprite, new Vector2(PlantMenuData.activeMenuPosition, -25), Color.WHITE, 0, 0.5);
        }
    }
}
