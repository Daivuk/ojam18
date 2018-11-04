var FocusConstants = new (function() {
    this.plantTypeLevel0 = 0;
    this.plantTypeLevel1 = 1;
    this.plantTypeLevel2 = 2;
    this.plantTypeLevel3 = 3;
    this.fertileGroundType = 4;
    // TODO: Change to a different asset?
    this.typeIcon = playSpriteAnim("icons.json", "seed");
    this.focusArrowYPositions = [
        -20, // plantTypeLevel0
        -29, // plantTypeLevel1
        -39, // plantTypeLevel2
        -48, // plantTypeLevel3
        -6, // fertileGroundType
    ];
    this.focusAnim = new NumberAnim(-1);
    this.focusAnim.playSingle(-1, 1, 1, Tween.EASE_BOTH, Loop.PING_PONG_LOOP);
});

function focus_reset_data()
{
    return new (function() {
        this.focusItems = [];
        this.currentFocusItemIndex = null;
        this.dtMsSinceLastLeft = 0;
        this.dtMsSinceLastRight = 0;
    });
}

var FocusData = focus_reset_data();

var FocusDataSaveProperties = [
    "currentFocusItemIndex"
];

function focus_load(loadData)
{
    // We do not store the focus items because they need to be references. Reset and they will be loaded by their origin.
    FocusData.focusItems = [];
}

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

    if (FocusData.currentFocusItemIndex == null && FocusData.focusItems.length > 1)
    {
        // Initially set focus to the first plant which is at index 1.
        focus_set_current_focus_index(1);   
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
    if (input_is_left_down() &&  FocusData.dtMsSinceLastLeft > 150) 
    {
        FocusData.dtMsSinceLastLeft = 0;
        focus_set_current_focus_index(Math.max(0, FocusData.currentFocusItemIndex - 1));
    }
    else
    {
        FocusData.dtMsSinceLastLeft += dt * 1000;
    }

    if (input_is_right_down() &&  FocusData.dtMsSinceLastRight > 150)
    {
        FocusData.dtMsSinceLastRight = 0;
        focus_set_current_focus_index(Math.min(FocusData.currentFocusItemIndex + 1, FocusData.focusItems.length - 1));
    }
    else
    {
        FocusData.dtMsSinceLastRight += dt * 1000;
    }
}

function focus_set_current_focus_index(index)
{
    FocusData.currentFocusItemIndex = index;
    var currentItem = FocusData.focusItems[FocusData.currentFocusItemIndex];
    if (focus_is_plant_type(currentItem.type))
    {
        if (currentItem.itemData.dead)
        {
            FocusConstants.typeIcon.play("skull");
        }
        else
        {
            switch(currentItem.itemData.type)
            {
                case PlantType.NORMAL:
                    FocusConstants.typeIcon.play("bio");
                    break;
                case PlantType.SEED:
                    FocusConstants.typeIcon.play("seed");
                    break;
                case PlantType.SOLAR:
                    FocusConstants.typeIcon.play("sun");
                    break;
                case PlantType.WATER:
                    FocusConstants.typeIcon.play("water");
                    break;
            }
        }
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

    if (FertileGroundData.activeMenuPosition == null && PlantMenuData.activeMenuPosition == null)
    {
        var arrowPosition = new Vector2(currentFocusItem.itemData.position, FocusConstants.focusArrowYPositions[focusType] +
            FocusConstants.focusAnim.get() * 1);
        SpriteBatch.drawSpriteAnim(dayArrow, arrowPosition);
        if (focus_is_plant_type(currentFocusItem.type))
        {
            SpriteBatch.drawSpriteAnim(FocusConstants.typeIcon, new Vector2(arrowPosition.x, arrowPosition.y - 10));
        }
    }
}

function focus_is_plant_type(type)
{
    return type == FocusConstants.plantTypeLevel0
           || type == FocusConstants.plantTypeLevel1
           || type == FocusConstants.plantTypeLevel2
           || type == FocusConstants.plantTypeLevel3;
}
