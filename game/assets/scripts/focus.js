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
        FocusData.currentFocusItemIndex = 0;   
    }
}

function focus_item_remove(_type, _id)
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

function focus_update()
{
    if (Input.isJustDown(Key.LEFT)) 
    {
        FocusData.currentFocusItemIndex = Math.max(0, FocusData.currentFocusItemIndex - 1);
    } 
    else if (Input.isJustDown(Key.RIGHT))
    {
        FocusData.currentFocusItemIndex = Math.min(FocusData.currentFocusItemIndex + 1, FocusData.focusItems.length - 1);
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
            focusType = FocusData.currentFocusItem.type;
        break;

    }
    currentFocusItem.type = focusType;
    SpriteBatch.drawSpriteAnim(dayArrow, new Vector2(0, FocusConstants.focusArrowYPositions[focusType]));
}