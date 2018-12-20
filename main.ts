let sprite: Sprite = sprites.create(img`
     . . . 9 9 9 9 9 9 9 9 9 9 . . .
     . . 9 9 f f f f f f f f 9 9 . .
     . 9 f f d d d d d d d d f f 9 .
     9 f d d d d d d d d d d d d f 9
     9 f d d d f d d d d f d d d f 9
     f d d d d f d d d d f d d d d f
     f d d d d f d d d d f d d d d f
     f d d d d f d d d d f d d d d f
     9 f d d d d d d d d d d d d f 9
     9 f d d d d d d d d d d d d f 9
     9 9 f f d d d d d d d d f f 9 9
     3 3 9 9 f f f f f f f f 9 9 3 3
     3 3 . 9 9 9 9 9 9 9 9 9 9 . 3 3
     . . 9 9 9 9 9 9 9 9 9 9 9 9 . .
     . . 3 3 9 9 9 9 9 9 9 9 3 3 . .
     . . 3 3 . . . . . . . . 3 3 . .
     `);


controller.moveSprite(sprite);

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let candle: Sprite = sprites.create(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . 2 . . . . . . . .
    . . . . . . 2 2 4 . . . . . . .
    . . . . . . 2 4 5 . . . . . . .
    . . . . . . . 2 . . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    . . . . . . 9 9 9 . . . . . . .
    `);
    candle.x = sprite.x;
    candle.y = sprite.y;
    candle.z = sprite.z - 1;
    candle.lifespan = 2000;
})

scene.setTileMap(img`
    c c c c c c c c c c
    c d d d d d d d c c
    c d c d c d c d c c
    c d d d d d d d c c
    c d d d d d d d c c
    c d c d c d c d c c
    c d d d d d d d c c
    c c c c c c c c c c
    `);
scene.setTile(0xc, img`
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    c c c c c c c c c c c c c c c c
    `, true);