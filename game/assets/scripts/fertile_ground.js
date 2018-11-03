
var FertileGroundData = {
    grounds: [],
    globalId: 0,
    activeMenuPosition: null,
    selectedPlantType: null
};

var FertileGroundConstants = {
    menuSprite: playSpriteAnim("seeding_ui.json", "center")
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

function fertile_ground_update()
{
    var currentFocusItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
    if (currentFocusItem.type == FocusConstants.fertileGroundType)
    {
        if (Input.isJustDown(Key.SPACE_BAR))
        {
            FertileGroundConstants.menuSprite.play("center");
        }

        if (Input.isDown(Key.SPACE_BAR))
        {
            FertileGroundData.activeMenuPosition = currentFocusItem.itemData.position;
            if (Input.isDown(Key.UP))
            {
                FertileGroundConstants.menuSprite.play("up");
                FertileGroundData.selectedPlantType = PlantType.SEED;
            }
            else if (Input.isDown(Key.DOWN))
            {
                FertileGroundConstants.menuSprite.play("bottom");
                FertileGroundData.selectedPlantType = PlantType.NORMAL;
            }
            else if (Input.isDown(Key.LEFT))
            {
                FertileGroundConstants.menuSprite.play("left");
                FertileGroundData.selectedPlantType = PlantType.WATER;
            }
            else if (Input.isDown(Key.RIGHT))
            {
                FertileGroundConstants.menuSprite.play("right");
                FertileGroundData.selectedPlantType = PlantType.SOLAR;
            }
            else
            {
                FertileGroundConstants.menuSprite.play("center");
                FertileGroundData.selectedPlantType = null;
            }
        }
        else
        {
            FertileGroundData.activeMenuPosition = null;
        }

        if(FertileGroundData.selectedPlantType && Input.isJustUp(Key.SPACE_BAR))
        {
            plant_create(currentFocusItem.itemData.position, FertileGroundData.selectedPlantType);
            FertileGroundData.selectedPlantType = null;
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
    if (FertileGroundData.activeMenuPosition != null)
    {
        SpriteBatch.drawSpriteAnim(FertileGroundConstants.menuSprite, new Vector2(FertileGroundData.activeMenuPosition, -25));
    }
}
