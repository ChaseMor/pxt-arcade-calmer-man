const CELL_SIZE: number = 10;

const PADDING_TOP: number = -5;
const PADDING_LEFT: number = 5;
const PADDING_BOTTOM: number = -5;
const PADDING_RIGHT: number = 5;

const WIDTH: number = Math.idiv(screen.width
    - (PADDING_LEFT + PADDING_RIGHT), CELL_SIZE);
const HEIGHT: number = Math.idiv(screen.height
    - (PADDING_TOP + PADDING_BOTTOM), CELL_SIZE);

enum BackgroundImageTypes {
    Floor,
    Block
}

let backgroundImages: Image[] = [];
let cells: number[] = [];

game.currentScene().physicsEngine = new CalmerManPhysicsEngine();
game.consoleOverlay.setVisible(true);

addImage(img`
    7 7 7 7 7 7 7 7 6 7
    7 6 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7
    7 7 7 7 6 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 6 7 7 7
    7 6 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7
    `, BackgroundImageTypes.Floor)
addImage(img`
    c c c c c c c c c c
    b b c b b b b b b b
    b b c b b b b b b b
    b b c b b b b b b b
    b b c b b b b b b b
    c c c c c c c c c c
    b b b b b b c b b b
    b b b b b b c b b b
    b b b b b b c b b b
    b b b b b b c b b b
    `, BackgroundImageTypes.Block)

createGrid();

let player: Sprite = sprites.create(img`
    . . . 9 9 9 9 . . .
    . 9 9 d d d d 9 9 .
    9 d d f d d f d d 9
    9 d d f d d f d d 9
    . 9 9 d d d d 9 9 .
    3 3 . 9 9 9 9 . 3 3
    3 3 9 9 9 9 9 9 3 3
    . . 9 9 9 9 9 9 . .
    . . 3 3 9 9 3 3 . .
    . . 3 3 . . 3 3 . .
    `, 0);

game.eventContext().registerFrameHandler(19, function () {
    player.setVelocity(0, 0);
    if (controller.up.isPressed()) {
        player.vy = -50;
    } else if (controller.down.isPressed()) {
        player.vy = 50;
    } else if (controller.left.isPressed()) {
        player.vx = -50
    } else if (controller.right.isPressed()) {
        player.vx = 50;
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let candle: Sprite = sprites.create(img`
        . . . . 5 . . . . .
        . . . 2 5 . . . . .
        . . . . 2 4 . . . .
        . . . . 2 2 . . . .
        . . . . 6 6 . . . .
        . . . . 6 9 . . . .
        . . . . 9 9 . . . .
        . . . . 9 9 . . . .
        . . . . 9 9 . . . .
        . . . . 9 9 . . . .
        `, 0);


    candle.x = player.x;
    candle.y = player.y;
    candle.lifespan = 2000;
})
game.onPaint(function () {
    drawCells();
});

/**
 * Fills up the cells with initial images
 */
function createGrid() {
    // All floor
    for (let y: number = 0; y < HEIGHT; y++) {
        for (let x: number = 0; x < WIDTH; x++) {
            cells.push(BackgroundImageTypes.Floor);
        }
    }

    // Surrounding Blocks
    // Top & Bottom
    for (let x: number = 0; x < WIDTH; x++) {
        cells[coordToIndex(x, 0)] = BackgroundImageTypes.Block;
        cells[coordToIndex(x, HEIGHT - 1)] = BackgroundImageTypes.Block;
    }
    // Left & Right
    for (let y: number = 1; y < HEIGHT - 1; y++) {
        cells[coordToIndex(0, y)] = BackgroundImageTypes.Block;
        cells[coordToIndex(WIDTH - 1, y)] = BackgroundImageTypes.Block;
    }

    // Middle Blocks
    for (let x: number = 2; x < WIDTH - 1; x += 2) {
        for (let y: number = 2; y < HEIGHT - 1; y += 2) {
            cells[coordToIndex(x, y)] = BackgroundImageTypes.Block;
        }
    }
}

/**
 * Gets the cell index value from the given coordinates
 *
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns the cell index value from the given coordinates
 */
function coordToIndex(x: number, y: number): number {
    return Math.trunc(y * WIDTH + x % WIDTH);
}

/**
 * Adds an image to the collection of cell Images
 *
 * @param img The image to be added
 * @param imageType The type of image being added
 */
function addImage(img: Image, imageType: BackgroundImageTypes) {
    while (backgroundImages.length < imageType) {
        backgroundImages.push(null);
    }
    backgroundImages[imageType] = img;
}


/**
 * Renders the cells onto the screen
 */
function drawCells() {
    for (let x: number = 0; x < WIDTH; x++) {
        for (let y: number = 0; y < HEIGHT; y++) {
            screen.drawImage(backgroundImages[cells[coordToIndex(x, y)]]
                , PADDING_LEFT + (x * CELL_SIZE)
                , PADDING_TOP + (y * CELL_SIZE));
        }
    }
}