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