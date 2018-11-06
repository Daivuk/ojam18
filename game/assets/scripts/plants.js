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

function plant_reset_data()
{
    return {
        plants : [],
        globalId: 0,
        dtMsSinceLastConsume: 0
    }
}

var PlantData = plant_reset_data();

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

function plant_load()
{
    // Focus items needs to be a reference to the actual plant items, so they are not saved.
    // Reload here.
    PlantData.plants.forEach(function(plant){
        focus_item_create(FocusConstants.plantTypeLevel0, plant.id, plant);
    });

    // Need to re-create the sprites as they can't be saved
    PlantData.plants.forEach(function(plant) {
        plant.waterBar = playSpriteAnim("bars.json", "water4");
        plant.sunBar = playSpriteAnim("bars.json", "sun4");
    });
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
        shines: [],
        shineTime: 0,
        dead: false,
        levelPercent: 0,
        id: PlantData.globalId,
        waterBar: playSpriteAnim("bars.json", "water4"),
        sunBar: playSpriteAnim("bars.json", "sun4"),
        prevSprite: playSpriteAnim("tree.json", "seed_level0"),
        sprite: playSpriteAnim("tree.json", "seed_level0")
    };

    PlantData.plants.push(plant);
    focus_item_create(FocusConstants.plantTypeLevel0, PlantData.globalId, plant);

    PlantData.globalId++;

    return plant;
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
        plant_make_dead(_plant);
    }
}

function plant_make_dead(_plant)
{
    _plant.dead = true;
    _plant.seed = 0;
    _plant.biomass = 0;
    // Update the focus to the same index so that the focus icon will update for the dead state.
    focus_set_current_focus_index(FocusData.currentFocusItemIndex);
}

function plant_destroy(_plant)
{
    var plantIndex = -1;

    for(var i = 0; i < PlantData.plants.length; ++i)
    {
        if(PlantData.plants[i].id == _plant.id)
        {
            plantIndex = i;
            break;
        }
    }

    if (!_plant.dead)
    {
        ResourcesData.biomass++;
    }

    if(plantIndex != -1)
    {
        PlantData.plants.splice(plantIndex, 1);

        var focusType = FocusConstants.plantTypeLevel0;

        switch(_plant.level)
        {
            case 1:
                focusType = FocusConstants.plantTypeLevel1;
                break;

            case 2:
                focusType = FocusConstants.plantTypeLevel2;
                break;

            case 3:
                focusType = FocusConstants.plantTypeLevel3;
                break;
        }

        
        focus_item_destroy(focusType, _plant.id);

        fertile_ground_create(_plant.position);
    }
}

function plants_update(dt)
{
    var waterLeeches = [];
    var surplusWaterPlants = [];

    var sunLeeches = [];
    var sunPlantBonus = 0;

    var alivePlantsCount = 0;
    for(var i = 0; i < PlantData.plants.length; ++i)
    {
        var plant = PlantData.plants[i];
        plant_age(plant, (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor);

        if(!plant.dead)
        {
            plant.levelPercent = Math.min(1, plant.levelPercent + dt);
            if (plant.seed == PLANT_SEED_MAX || plant.biomass == PLANT_BIOMASS_MAX)
            {
                plant.shineTime -= dt;
                while (plant.shineTime <= 0)
                {
                    plant.shineTime += 0.25;
                    plant.shines.push({
                        time: 0,
                        position: new Vector2(Random.randNumber(plant.position - 10, plant.position + 10), 0)
                    })
                }
                for (var j = 0; j < plant.shines.length; ++j)
                {
                    var shine = plant.shines[j];
                    shine.time += dt;
                    shine.position.y -= dt * 2 - shine.position.y * dt;
                    if (shine.time > 2)
                    {
                        plant.shines.splice(j, 1);
                        --j;
                    }
                }
            }

            // Seed
            if(plant.type == PlantType.SEED && plant.seed < PLANT_SEED_MAX)
            {
                var prev = plant.seed;
                plant.seed += PLANT_SEED_PROGRESS_PD * (plant.level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.seed = Math.min(plant.seed, PLANT_SEED_MAX);
                if (plant.seed > prev && plant.seed == PLANT_SEED_MAX) playSound("ready.wav", master_volume);
            }

            // Biomass
            if(plant.type == PlantType.NORMAL && plant.biomass < PLANT_BIOMASS_MAX)
            {
                var prev = plant.biomass;
                plant.biomass += PLANT_BIOMASS_PROGRESS_PD * (plant.level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.biomass = Math.min(plant.biomass, PLANT_BIOMASS_MAX);
                if (plant.biomass > prev && plant.biomass == PLANT_BIOMASS_MAX) playSound("ready.wav", master_volume);
            }

            // Water
            if(plant.type == PlantType.WATER && plant.level > 0)
            {
                plant.water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (plant.level + 1) * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.water = Math.min(plant.water, (plant.level + 1) * PLANT_WATER_MAX);
            }
            else
            {
                plant.water += PLANT_WATER_ABSORB_PD * weather_getWaterMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.water -= PLANT_WATER_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
                plant.water = Math.min(plant.water, PLANT_WATER_MAX);
            }

            // Sunlight
            plant.sun += PLANT_SUN_ABSORB_PD * day_getLightLevel() * weather_getSunMultiplier() * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            plant.sun -= PLANT_SUN_USAGE_PD * (dt / DayConstants.secondsPerDay) * DayData.timeScaleFactor;
            plant.sun = Math.min(plant.sun, PLANT_SUN_MAX);

            alivePlantsCount++;
        }

        // Find all the water and sun plants to apply their global effects
        if((plant.sun <= 0 || plant.water <= 0) && !plant.dead)
        {
            plant_make_dead(plant);
        }


        if(plant.type == PlantType.WATER && plant.water > PLANT_WATER_MAX && !plant.dead)
        {
            surplusWaterPlants.push(plant);
        }

        if(plant.water < PLANT_WATER_MAX || plant.dead)
        {
            waterLeeches.push(plant);
        }

        if(plant.type == PlantType.SOLAR && plant.level > 0 && !plant.dead)
        {
            sunPlantBonus += plant.level * PLANT_SUN_BONUS_PD;
        }

        if(plant.sun < PLANT_SUN_MAX || plant.dead)
        {
            // Sun plants also benefit from their own sun bonus
            sunLeeches.push(plant);
        }

        if(!plant.dead)
        {
            var waterCap = PLANT_WATER_MAX;
            if (plant.type == PlantType.WATER && plant.level > 0)
            {
                waterCap = (plant.level + 1) * PLANT_WATER_MAX;
            }
            if (waterCap > PLANT_WATER_MAX)
            {
                if (plant.water <= PLANT_WATER_MAX + 5)
                {
                    var waterPercent = plant.water / PLANT_WATER_MAX;
                    var waterLevel = Math.min(4, Math.round(waterPercent * 4));
                    if (waterPercent > 0 && waterLevel === 0) waterLevel = 1;
                    plant.waterBar.play("watertank" + waterLevel + "_" + plant.level);
                }
                else
                {
                    var waterPercent = (plant.water - PLANT_WATER_MAX + 5) / (320);
                    var waterLevel = Math.max(0, Math.min(5, Math.floor(waterPercent * 6)));
                    plant.waterBar.play("watertank" + (5 + waterLevel) + "_" + plant.level);
                }
            }
            else
            {
                var waterPercent = plant.water / PLANT_WATER_MAX;
                var waterLevel = Math.min(4, Math.round(waterPercent * 4));
                if (waterPercent > 0 && waterLevel === 0) waterLevel = 1;
                plant.waterBar.play("water" + waterLevel);
            }

            var sunPercent = plant.sun / PLANT_SUN_MAX;
            var sunLevel = Math.min(4, Math.round(sunPercent * 4));
            if (sunPercent > 0 && sunLevel === 0) sunLevel = 1;
            plant.sunBar.play("sun" + sunLevel);
        }
    }

    if (alivePlantsCount == 0 && ResourcesData.seeds == 0)
    {
        main_menu_show(true);
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
    if (input_is_activation_just_down() && focus_is_plant_type(FocusData.focusItems[FocusData.currentFocusItemIndex].type))
    {
        var focusItem = FocusData.focusItems[FocusData.currentFocusItemIndex].itemData;
        if(focusItem.seed == PLANT_SEED_MAX)
        {
            updateMsSinceLastConsume = false;
            handled = true;
            ResourcesData.seeds++;
            ResourcesData.seedsBounceAnim.stop();
            ResourcesData.seedsBounceAnim.set(0);
            ResourcesData.seedsBounceAnim.queue(1, .2, Tween.EASE_OUT);
            ResourcesData.seedsBounceAnim.queue(0, .4, Tween.BOUNCE_OUT);
            ResourcesData.seedsBounceAnim.play();
            focusItem.seed = 0;
            PlantData.dtMsSinceLastConsume = 0;
            playSound("pickup2.wav", master_volume);
        }

        if(focusItem.biomass == PLANT_BIOMASS_MAX)
        {
            updateMsSinceLastConsume = false;
            handled = true;
            ResourcesData.biomass++;
            ResourcesData.biomassBounceAnim.stop();
            ResourcesData.biomassBounceAnim.set(0);
            ResourcesData.biomassBounceAnim.queue(1, .2, Tween.EASE_OUT);
            ResourcesData.biomassBounceAnim.queue(0, .4, Tween.BOUNCE_OUT);
            ResourcesData.biomassBounceAnim.play();
            focusItem.biomass = 0;
            PlantData.dtMsSinceLastConsume = 0;
            playSound("pickup2.wav", master_volume);
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
            if (input_is_activation_just_up())
            {
                PlantMenuData.menuSprite.play("center");
            }

            if (input_is_activation_down())
            {
                PlantMenuData.activeMenuPosition = currentFocusItem.itemData.position;
                if (input_is_up_down() && PlantMenuData.action != "level")
                {
                    PlantMenuData.menuSprite.play("up");
                    PlantMenuData.action = "level";
                }
                else if (input_is_down_down() && PlantMenuData.action != "destroy")
                {
                    PlantMenuData.menuSprite.play("bottom");
                    PlantMenuData.action = "destroy";
                }

                if (!PlantMenuData.menuAborted && input_is_vertical_direction_just_up())
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

            if(PlantMenuData.action == "level" && input_is_activation_just_up())
            {
                if(currentFocusItem.itemData.level < 3 && ResourcesData.biomass > 0 && !currentFocusItem.itemData.dead)
                {
                    currentFocusItem.itemData.level++;
                    currentFocusItem.itemData.levelPercent = 0;
                    currentFocusItem.itemData.prevSprite.play();
                    ResourcesData.biomass--;
                    playSound("levelup.wav", master_volume, 0, 2);
                }

                PlantMenuData.action = "none";
            }

            if(PlantMenuData.action == "destroy" && input_is_activation_just_up())
            {
                plant_destroy(currentFocusItem.itemData);

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
        var plant = PlantData.plants[i];

        if(plant.dead)
        {
            color = new Color(0.2, 0.2, 0.2, 1.0);
        }

        plant.prevSprite.play(plant.type + "_level" + Math.max(plant.level - 1, 0));
        plant.sprite.play(plant.type + "_level" + Math.min(plant.level, 3));
        if (plant.levelPercent < 1 && plant.level > 0) SpriteBatch.drawSpriteAnim(plant.prevSprite, new Vector2(plant.position, 0.0), color.mul(1 - (plant.levelPercent*plant.levelPercent)), 0, 1 + plant.levelPercent * .25);
        if (plant.levelPercent > 0) SpriteBatch.drawSpriteAnim(plant.sprite, new Vector2(plant.position, 0.0), color.mul(plant.levelPercent * plant.levelPercent), 0, 1 - (1 - plant.levelPercent) * .25);

        if(!plant.dead)
        {
            var invP = 1 - zoomFadePercent;
            invP *= invP;
            SpriteBatch.drawSpriteAnim(plant.waterBar, 
                new Vector2(plant.position, invP * 30), zoomFadeColor, 0, 0.6);
            SpriteBatch.drawSpriteAnim(plant.sunBar, 
                new Vector2(plant.position, invP * 30), zoomFadeColor, 0, 0.6);
            // SpriteBatch.drawText(font, "" + Math.floor(plant.water), new Vector2(plant.position, -32));
            // SpriteBatch.drawRect(null, new Rect(plant.position - 8, -plant.water / 10, 2, plant.water / 10), new Color(0, 0, 1, 1));
            // SpriteBatch.drawRect(null, new Rect(plant.position - 11, -plant.sun / 10, 2, plant.sun / 10), new Color(0, 1, 0, 1));
        }

        // if(plant.seed == PLANT_SEED_MAX || plant.biomass == PLANT_BIOMASS_MAX)
        // {
        //     SpriteBatch.drawRect(null, new Rect(plant.position, -2, 2, 2), new Color(1, 1, 1, 1));
        // }

        if (PlantMenuData.activeMenuPosition != null)
        {
            SpriteBatch.drawSpriteAnim(PlantMenuData.menuSprite, new Vector2(PlantMenuData.activeMenuPosition, -25), Color.WHITE, 0, 0.5);
        }
    }
}

function plants_renderAction()
{
    var color0 = new Color(0);
    var color1 = new Color(0, .5, .3, .25);

    for (var i = 0; i < PlantData.plants.length; ++i)
    {
        var plant = PlantData.plants[i];

        if (plant.dead) continue;
        if (plant.seed == PLANT_SEED_MAX || plant.biomass == PLANT_BIOMASS_MAX)
        {
            plant.shines.forEach(function(shine)
            {
                var percent = shine.time;
                if (percent > 1) percent = 1 - (percent - 1);
                SpriteBatch.drawRectWithColors(null,
                    new Rect(shine.position.x - 2, shine.position.y - 20, 4, 20),
                    color0.mul(percent), color1.mul(percent), color1.mul(percent), color0.mul(percent));
                SpriteBatch.drawRectWithColors(null,
                    new Rect(shine.position.x - 2, shine.position.y, 4, 4),
                    color1.mul(percent), color0.mul(percent), color0.mul(percent), color1.mul(percent));
            });
        }
    }
}
