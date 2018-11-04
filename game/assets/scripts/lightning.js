var lightning = {
    timeTilNext: Random.randNumber(2, 4),
    anim: new NumberAnim(0)
};

function lightning_init()
{

}

function lightning_update(dt)
{
    lightning.timeTilNext -= dt;
    if (lightning.timeTilNext <= 0)
    {
        playSound("thunder.wav", master_volume);
        lightning.timeTilNext = Random.randNumber(3, 6);
        lightning.anim.stop();
        lightning.anim.set(0);
        lightning.anim.queue(2, .1, Tween.LINEAR);
        lightning.anim.queue(0, .1, Tween.LINEAR);
        lightning.anim.queue(4, .1, Tween.LINEAR);
        lightning.anim.queue(0, .1, Tween.LINEAR);
        lightning.anim.queue(2, .05, Tween.LINEAR);
        lightning.anim.queue(0, .15, Tween.LINEAR);
        lightning.anim.play();
    }

    var val = lightning.anim.get();
    if (val > 0)
    {
        RGB.r = new Vector3(val);
    }
}

function lightning_render()
{

}
