function input_is_activation_just_down()
{
    return Input.isJustDown(Key.SPACE_BAR) || Input.isJustDown(Key.ENTER) || GamePad.isJustDown(0, Button.A);
}

function input_is_activation_down()
{
    return Input.isDown(Key.SPACE_BAR) || Input.isDown(Key.ENTER) || GamePad.isDown(0, Button.A);
}

function input_is_activation_just_up()
{
    return Input.isJustUp(Key.SPACE_BAR) || Input.isJustUp(Key.ENTER) || GamePad.isJustUp(0, Button.A);
}

function input_is_up_just_down()
{
    return Input.isJustDown(Key.UP) || Input.isJustDown(Key.W) || GamePad.isJustDown(0, Button.LEFT_THUMBSTICK_UP);
}

function input_is_up_down()
{
    return Input.isDown(Key.UP) || Input.isDown(Key.W) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP);
}

function input_is_down_just_down()
{
    return Input.isJustDown(Key.DOWN) || Input.isJustDown(Key.S) || GamePad.isJustDown(0, Button.LEFT_THUMBSTICK_DOWN);
}

function input_is_down_down()
{
    return Input.isDown(Key.DOWN) || Input.isDown(Key.S) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN);
}

function input_is_left_just_down()
{
    return Input.isJustDown(Key.LEFT) || Input.isJustDown(Key.A) || GamePad.isJustDown(0, Button.LEFT_THUMBSTICK_LEFT);
}

function input_is_left_down()
{
    return Input.isDown(Key.LEFT) || Input.isDown(Key.A) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_LEFT);
}

function input_is_right_just_down()
{
    return Input.isJustDown(Key.RIGHT) || Input.isJustDown(Key.D) || GamePad.isJustDown(0, Button.LEFT_THUMBSTICK_RIGHT);
}

function input_is_right_down()
{
    return Input.isDown(Key.RIGHT) || Input.isJustDown(Key.D) || GamePad.isJustDown(0, Button.LEFT_THUMBSTICK_RIGHT);
}

function input_is_any_direction_just_up()
{
    return Input.isJustUp(Key.UP) || Input.isJustUp(Key.DOWN) || Input.isJustUp(Key.LEFT) || Input.isJustUp(Key.RIGHT) 
    || Input.isJustUp(Key.W) || Input.isJustUp(Key.A) || Input.isJustUp(Key.S) || Input.isJustUp(Key.D) 
    || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_LEFT) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_RIGHT);
}

function input_is_vertical_direction_just_up()
{
    return Input.isJustUp(Key.UP) || Input.isJustUp(Key.DOWN)
    || Input.isJustUp(Key.W) || Input.isJustUp(Key.S)
    || GamePad.isDown(0, Button.LEFT_THUMBSTICK_UP) || GamePad.isDown(0, Button.LEFT_THUMBSTICK_DOWN);
}