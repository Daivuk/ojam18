var showDebug = false;

function debug_update(dt)
{
    if (Input.isJustDown(Key.TAB))
    {
        showDebug = !showDebug;
    }
}

function debug_renderUI()
{
    if (!showDebug) return;
    
    if (GUI.begin("Debug Menu"))
    {

    }
    GUI.end();
}
