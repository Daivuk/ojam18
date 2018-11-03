
var FertileGroundData = {
    grounds: [],
    globalId: 0,
    activeMenuPosition: null,
    selectedPlantType: null
};

var FertileGroundConstants = {
    menuSprite: playSpriteAnim("seeding_ui.json", "center")
}

var fertile_groundSprite = playSpriteAnim("fertile_ground.json", "idle");

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
    if (currentFocusItem.type == FocusConstants.fertileGroundType)
    {
        if (Input.isDown(Key.SPACE_BAR))
        {
            FertileGroundData.activeMenuPosition = currentFocusItem.itemData.position;
            if (Input.isDown(Key.UP) && FertileGroundData.selectedPlantType != PlantType.SEED)
            {
                FertileGroundConstants.menuSprite.play("up");
                FertileGroundData.selectedPlantType = PlantType.SEED;
            }
            else if (Input.isDown(Key.DOWN) && FertileGroundData.selectedPlantType != PlantType.NORMAL)
            {
                FertileGroundConstants.menuSprite.play("bottom");
                FertileGroundData.selectedPlantType = PlantType.NORMAL;
            }
            else if (Input.isDown(Key.LEFT) && FertileGroundData.selectedPlantType != PlantType.WATER)
            {
                FertileGroundConstants.menuSprite.play("left");
                FertileGroundData.selectedPlantType = PlantType.WATER;
            }
            else if (Input.isDown(Key.RIGHT) && FertileGroundData.selectedPlantType != PlantType.SOLAR)
            {
                FertileGroundConstants.menuSprite.play("right");
                FertileGroundData.selectedPlantType = PlantType.SOLAR;
            }

            if (FertileGroundData.selectedPlantType != null && (Input.isJustUp(Key.UP) || Input.isJustUp(Key.DOWN) || Input.isJustUp(Key.LEFT) || Input.isJustUp(Key.RIGHT)))
            {
                FertileGroundConstants.menuSprite.play("center");
                FertileGroundData.selectedPlantType = null;
            }
        }
        else
        {
            FertileGroundData.activeMenuPosition = null;
        }

        if(FertileGroundData.selectedPlantType && Input.isJustUp(Key.SPACE_BAR) && seeds > 0)
        {
            fertile_ground_destroy(currentFocusItem.itemData.position);
            plant_create(currentFocusItem.itemData.position, FertileGroundData.selectedPlantType);
            seeds--;
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
    FertileGroundData.grounds.forEach(function(ground)
    {
        SpriteBatch.drawSpriteAnim(fertile_groundSprite, new Vector2(ground.position, 0));
    });

    if (FertileGroundData.activeMenuPosition != null)
    {
        SpriteBatch.drawSpriteAnim(FertileGroundConstants.menuSprite, new Vector2(FertileGroundData.activeMenuPosition, -25));
    }
}
