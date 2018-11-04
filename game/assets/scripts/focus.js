var FocusConstants = new (function() {
    this.plantTypeLevel0 = 0;
    this.plantTypeLevel1 = 1;
    this.plantTypeLevel2 = 2;
    this.plantTypeLevel3 = 3;
    this.fertileGroundType = 4;
    // TODO: Change to a different asset?
    this.focusArrow = playSpriteAnim("day_arrow.json", "idle");
    this.focusArrowYPositions = [
        -15, // plantTypeLevel0
        -22, // plantTypeLevel1
        -35, // plantTypeLevel2
        -45, // plantTypeLevel3
        -5, // fertileGroundType
    ];
});

var FocusData = new (function() {
    this.focusItems = [];
    this.currentFocusItemIndex = null;
    this.dtMsSinceLastLeft = 0;
    this.dtMsSinceLastRight = 0;
});

function focus_item_create(_type, _id, _itemData)
{
    var focusItem = {
        type: _type,
        id: _id,
        itemData: _itemData
    };

    FocusData.focusItems.push(focusItem);
    FocusData.focusItems.sort(function(a, b){
        return a.itemData.position - b.itemData.position;
    });

    if (FocusData.currentFocusItemIndex == null)
    {
        // Initially set focus to the first plant which is at index 1.
        FocusData.currentFocusItemIndex = 1;   
    }
}

function focus_item_destroy(_type, _id)
{
    var indexToRemove = null;
    for(var i = 0; i < FocusData.focusItems.length; i++)
    {
        var item = FocusData.focusItems[i];
        if (item.type == _type && item.id == _id)
        {
            indexToRemove = i;
            break;
        }
    }
    
    if (indexToRemove != null)
    {
        FocusData.focusItems.splice(indexToRemove, 1);
    }
}

function focus_update(dt)
{
    if ((Input.isDown(Key.LEFT) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_LEFT)) &&  FocusData.dtMsSinceLastLeft > 100) 
    {
        FocusData.dtMsSinceLastLeft = 0;
        FocusData.currentFocusItemIndex = Math.max(0, FocusData.currentFocusItemIndex - 1);
    }
    else
    {
        FocusData.dtMsSinceLastLeft += dt * 1000;
    }

    if ((Input.isDown(Key.RIGHT) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_RIGHT)) &&  FocusData.dtMsSinceLastRight > 100)
    {
        FocusData.dtMsSinceLastRight = 0;
        FocusData.currentFocusItemIndex = Math.min(FocusData.currentFocusItemIndex + 1, FocusData.focusItems.length - 1);
    }
    else
    {
        FocusData.dtMsSinceLastRight += dt * 1000;
    }
}

function focus_render()
{
    var focusType;
    var currentFocusItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
    switch(currentFocusItem.type)
    {
        // Plants level can change ensure the type is up to date.
        case FocusConstants.plantTypeLevel0:
        case FocusConstants.plantTypeLevel1:
        case FocusConstants.plantTypeLevel2:
        case FocusConstants.plantTypeLevel3:
            switch(currentFocusItem.itemData.level)
            {
                case 0:
                    focusType = FocusConstants.plantTypeLevel0;
                    break;
                case 1:
                    focusType = FocusConstants.plantTypeLevel1;
                    break;
                case 2:
                    focusType = FocusConstants.plantTypeLevel2;
                    break;
                case 3:
                    focusType = FocusConstants.plantTypeLevel3;
                    break;
                case 4:
                    focusType = FocusConstants.plantTypeLevel3;
                    break;
            }
        break;
        default:
            focusType = currentFocusItem.type;
        break;

    }
    currentFocusItem.type = focusType;
    SpriteBatch.drawSpriteAnim(dayArrow, new Vector2(currentFocusItem.itemData.position, FocusConstants.focusArrowYPositions[focusType]));
}

function focus_is_plant_type(type)
{
    return type == FocusConstants.plantTypeLevel0
           || type == FocusConstants.plantTypeLevel1
           || type == FocusConstants.plantTypeLevel2
           || type == FocusConstants.plantTypeLevel3;
}
