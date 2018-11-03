
var FertileGroundData = {
    grounds: [],
    globalId: 0,
    activeMenuPosition: null,
    menuSprites: []
};

var FertileGroundConstants = {
    menuDirections: ["up", "bottom", "left", "right", "center"],
    menuUp: 0,
    menuDown: 1,
    menuLeft: 2,
    menuRight: 3,
    menuCenter: 4
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
    if (currentFocusItem.type == FocusConstants.fertileGroundType && Input.isDown(Key.SPACE_BAR))
    {
        FertileGroundData.activeMenuPosition = currentFocusItem.itemData.position;
        if (Input.isJustDown(Key.SPACE_BAR))
        {
            print("PLAY SPACE");
            FertileGroundData.menuSprites[FertileGroundConstants.menuCenter].play();
        }
        else if (Input.isJustDown(Key.UP))
        {
            print("PLAY UP");
            FertileGroundData.menuSprites[FertileGroundConstants.menuUp].play();
        }
        else if (Input.isJustDown(Key.DOWN))
        {
            print("PLAY DOWN");
            FertileGroundData.menuSprites[FertileGroundConstants.menuDown].play();
        }
        else if (Input.isJustDown(Key.LEFT))
        {
            print("PLAY LEFT");
            FertileGroundData.menuSprites[FertileGroundConstants.menuLeft].play();
        }
        else if (Input.isJustDown(Key.RIGHT))
        {
            print("PLAY RIGHT");
            FertileGroundData.menuSprites[FertileGroundConstants.menuRight].play();
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
        SpriteBatch.drawSpriteAnim(FertileGroundData.menuSprites[FertileGroundConstants.menuCenter], new Vector2(FertileGroundData.activeMenuPosition, -25));
    }
}

function fertile_ground_init()
{
    FertileGroundConstants.menuDirections.forEach(function(menuDirection) {
        FertileGroundData.menuSprites.push(playSpriteAnim("seeding_ui.json", menuDirection));
    });
}