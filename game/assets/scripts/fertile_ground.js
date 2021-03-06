
function fertile_ground_reset_data()
{
    return {
        grounds: [],
        globalId: 0,
        activeMenuPosition: null,
        selectedPlantType: null,
        plantingAborted: false
    };
}

var FertileGroundData = fertile_ground_reset_data();

var FertileGroundDataSaveProperties = [
    "grounds",
    "globalId"
];

var FertileGroundConstants = {
    menuSprite: playSpriteAnim("seeding_ui.json", "center")
}

var fertile_groundSprite = playSpriteAnim("fertile_ground.json", "idle");

function fertile_ground_load()
{
    // Focus items needs to be a reference to the actual ground items, so they are not saved.
    // Reload here.
    FertileGroundData.grounds.forEach(function(ground){
        focus_item_create(FocusConstants.fertileGroundType, ground.id, ground);
    });
}

function fertile_ground_create(_position)
{
    var ground = {
        position: _position,
        id: FertileGroundData.globalId
    };

    FertileGroundData.grounds.push(ground);
    focus_item_create(FocusConstants.fertileGroundType, FertileGroundData.globalId, ground);

    FertileGroundData.globalId++;
}

function fertile_ground_destroy(_position)
{
    var groundToRemove = null;
    var indexToRemove = null;
    for(var i = 0; i < FertileGroundData.grounds.length; i++)
    {
        var ground = FertileGroundData.grounds[i];
        if (ground.position == _position)
        {
            groundToRemove = ground;
            indexToRemove = i;
            break;
        }
    }
    FertileGroundData.grounds.splice(indexToRemove, 1);
    focus_item_destroy(FocusConstants.fertileGroundType, groundToRemove.id);
}

function fertile_ground_update()
{
    var currentFocusItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
    if (currentFocusItem.type == FocusConstants.fertileGroundType && ResourcesData.seeds > 0)
    {
        if (input_is_activation_just_down())
        {
            FertileGroundConstants.menuSprite.play("center");
        }

        if (input_is_activation_down())
        {
            FertileGroundData.activeMenuPosition = currentFocusItem.itemData.position;
            if (input_is_up_down() && FertileGroundData.selectedPlantType != PlantType.SEED)
            {
                FertileGroundConstants.menuSprite.play("up");
                FertileGroundData.selectedPlantType = PlantType.SEED;
            }
            else if (input_is_down_down() && FertileGroundData.selectedPlantType != PlantType.NORMAL)
            {
                FertileGroundConstants.menuSprite.play("bottom");
                FertileGroundData.selectedPlantType = PlantType.NORMAL;
            }
            else if (input_is_left_down() && FertileGroundData.selectedPlantType != PlantType.WATER)
            {
                FertileGroundConstants.menuSprite.play("left");
                FertileGroundData.selectedPlantType = PlantType.WATER;
            }
            else if (input_is_right_down() && FertileGroundData.selectedPlantType != PlantType.SOLAR)
            {
                FertileGroundConstants.menuSprite.play("right");
                FertileGroundData.selectedPlantType = PlantType.SOLAR;
            }

            if (!FertileGroundData.plantingAborted && input_is_any_direction_just_up())
            {
                FertileGroundConstants.menuSprite.play("center");
                FertileGroundData.plantingAborted = true;
            }

            zoomFast = 1;
            zoomTargetOffset = 2;
        }
        else
        {
            FertileGroundData.activeMenuPosition = null;
            zoomTargetOffset = 0;
        }

        if (FertileGroundData.plantingAborted && !FertileGroundConstants.menuSprite.isPlaying())
        {
            FertileGroundData.plantingAborted = false;
            FertileGroundData.selectedPlantType = null;
        }

        if(FertileGroundData.selectedPlantType && input_is_activation_just_up() && ResourcesData.seeds > 0)
        {
            // playSound("");

            fertile_ground_destroy(currentFocusItem.itemData.position);
            plant_create(currentFocusItem.itemData.position, FertileGroundData.selectedPlantType);
            ResourcesData.seeds--;
            FertileGroundData.selectedPlantType = null;
            
            var shouldFixFocus = false;

            if(FocusData.currentFocusItemIndex == FocusData.focusItems.length - 1 || FocusData.currentFocusItemIndex == 0)
            {
                var newPosition;
                if (currentFocusItem.itemData.position > 0)
                {
                    newPosition = currentFocusItem.itemData.position + distanceBetweenPlants;     
                }
                else
                {
                    shouldFixFocus = true;
                    newPosition = currentFocusItem.itemData.position - distanceBetweenPlants;
                }
                
                fertile_ground_create(newPosition);
            }
            
            // If we added an item on the left we need to set focus to index 1 so it remains at the original position
            // Index 0 will now be the new fertile ground.
            if (shouldFixFocus)
            {
                focus_set_current_focus_index(1);
            }
        }
        
    }
    else
    {
        FertileGroundData.activeMenuPosition = null;
    }
}

function fertile_ground_is_menu_open()
{
    return FertileGroundData.activeMenuPosition != null;
}

function fertile_ground_render()
{
    FertileGroundData.grounds.forEach(function(ground)
    {
        SpriteBatch.drawSpriteAnim(fertile_groundSprite, new Vector2(ground.position, 0));
    });

    if (FertileGroundData.activeMenuPosition != null)
    {
        SpriteBatch.drawSpriteAnim(FertileGroundConstants.menuSprite, new Vector2(FertileGroundData.activeMenuPosition, -15), Color.WHITE, 0, 0.5);
    }
}
