var ResourcesConstants = {
    seedSprite: playSpriteAnim("icons.json", "seed"),
    biomassSprite: playSpriteAnim("icons.json", "bio")
}

function resources_reset_data()
{
    return {
        seeds: 1,
        biomass: 1,
        seedsBounceAnim: new NumberAnim(0),
        biomassBounceAnim: new NumberAnim(0),
        flyings: []
    }
}

var ResourcesData = resources_reset_data();

var ResourcesDataSaveProperties = [
    "seeds",
    "biomass"
];

function resources_addRes(type, posX)
{
    var screenPos3 = new Vector3(posX, 0, 0).transform(transform);
    var uiPos3 = screenPos3.transform(invTransformUI);

    var flying = {
        type: type,
        position: new Vector2(uiPos3.x, uiPos3.y),
        percent: 0
    }

    var invP = 1 - zoomFadePercent;
    invP *= invP;
    var resourcesBasePosition = new Vector2(10 - invP * 30, 45);

    flying.startPos = new Vector2(flying.position);
    switch (type)
    {
        case "seed":
            flying.targetPos = new Vector2(resourcesBasePosition.x, resourcesBasePosition.y);
            break;
        case "biomass":
            flying.targetPos = new Vector2(resourcesBasePosition.x, resourcesBasePosition.y + 20);
            break;
    }

    ResourcesData.flyings.push(flying);
}

function resources_update(dt)
{
    for (var i = 0; i < ResourcesData.flyings.length; ++i)
    {
        var flying = ResourcesData.flyings[i];

        flying.percent += dt;

        flying.position = Vector2.bezier(
            flying.startPos,
            flying.startPos.add(new Vector2(0, (flying.targetPos.y - flying.startPos.y) * 0.3)),
            flying.targetPos.add(new Vector2((flying.startPos.x - flying.targetPos.x) * 0.3, 0)),
            flying.targetPos,
            flying.percent
        );

        if (flying.percent >= 1)
        {
            switch (flying.type)
            {
                case "seed":
                    ResourcesData.seeds++;
                    ResourcesData.seedsBounceAnim.stop();
                    ResourcesData.seedsBounceAnim.set(0);
                    ResourcesData.seedsBounceAnim.queue(1, .2, Tween.EASE_OUT);
                    ResourcesData.seedsBounceAnim.queue(0, .4, Tween.BOUNCE_OUT);
                    ResourcesData.seedsBounceAnim.play();
                    break;
                case "biomass":
                    ResourcesData.biomass++;
                    ResourcesData.biomassBounceAnim.stop();
                    ResourcesData.biomassBounceAnim.set(0);
                    ResourcesData.biomassBounceAnim.queue(1, .2, Tween.EASE_OUT);
                    ResourcesData.biomassBounceAnim.queue(0, .4, Tween.BOUNCE_OUT);
                    ResourcesData.biomassBounceAnim.play();
                    break;
            }
            ResourcesData.flyings.splice(i, 1);
            --i;
        }
    }
}

function resources_render()
{
    var invP = 1 - zoomFadePercent;
    invP *= invP;

    var resourcesBasePosition = new Vector2(10 - invP * 30, 45);

    var patate = new Color(0, 0, 0, zoomFadeColor.a * 0.5);

    if (ResourcesData.seeds > 0)
    {
        var seedsSpritePosition = new Vector2(resourcesBasePosition.x + ResourcesData.seedsBounceAnim.get() * 8, resourcesBasePosition.y);
        SpriteBatch.drawInclinedRect(null, new Rect(-invP * 30, seedsSpritePosition.y - 8, 38, 16), -0.3, patate);
        SpriteBatch.drawSpriteAnim(ResourcesConstants.seedSprite, seedsSpritePosition, zoomFadeColor);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourcesData.seeds, new Vector2(seedsSpritePosition.x + 10, seedsSpritePosition.y), Vector2.LEFT, zoomFadeColor,
            patate, 1);
    }

    if (ResourcesData.biomass > 0)
    {
        var biomassSpritePosition = new Vector2(resourcesBasePosition.x + ResourcesData.biomassBounceAnim.get() * 8, resourcesBasePosition.y + 20);
        SpriteBatch.drawInclinedRect(null, new Rect(-invP * 30, biomassSpritePosition.y - 8, 38, 16), -0.3, patate);
        SpriteBatch.drawSpriteAnim(ResourcesConstants.biomassSprite, biomassSpritePosition, zoomFadeColor);
        SpriteBatch.drawPrettyOutlinedText(font, "" + ResourcesData.biomass, new Vector2(biomassSpritePosition.x + 10, biomassSpritePosition.y), Vector2.LEFT, zoomFadeColor,
            patate, 1);
    }

    ResourcesData.flyings.forEach(function(flying)
    {
        switch (flying.type)
        {
            case "seed":
                SpriteBatch.drawSpriteAnim(ResourcesConstants.seedSprite, flying.position);
                break;
            case "biomass":
                SpriteBatch.drawSpriteAnim(ResourcesConstants.biomassSprite, flying.position);
                break;
        }
    });
}