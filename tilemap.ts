namespace tiles {
    class TileSet {
        image: Image;
        obstacle: boolean;
        constructor(image: Image, collisions: boolean) {
            this.image = image;
            this.obstacle = collisions;
        }
    }

    export class CalmerManTileMap extends TileMap {
        CELL_SIZE: number;

        PADDING_TOP: number;
        PADDING_LEFT: number;
        PADDING_BOTTOM: number;
        PADDING_RIGHT: number;

        WIDTH: number;
        HEIGHT: number;

        constructor() {
            super();

            this.CELL_SIZE = 10;

            this.PADDING_TOP = -5;
            this.PADDING_LEFT = 5;
            this.PADDING_BOTTOM = -5;
            this.PADDING_RIGHT = 5;

            this.WIDTH = Math.idiv(screen.width
                - (PADDING_LEFT + PADDING_RIGHT), CELL_SIZE);
            this.HEIGHT = Math.idiv(screen.height
                - (PADDING_TOP + PADDING_BOTTOM), CELL_SIZE);
        }

        /**
         * Gets the cell index value from the given coordinates
         *
         * @param x The x coordinate
         * @param y The y coordinate
         * @returns the cell index value from the given coordinates
         */
        private coordToIndex(x: number, y: number): number {
            return Math.trunc(y * WIDTH + x % WIDTH);
        }

        /**
         * Adds an image to the collection of cell Images
         *
         * @param img The image to be added
         * @param imageType The type of image being added
         */
        addImage(img: Image, imageType: BackgroundImageTypes) {
            while (backgroundImages.length < imageType) {
                backgroundImages.push(null);
            }
            backgroundImages[imageType] = img;
        }

        setTile(index: number, img: Image, collisions?: boolean) {

            while (backgroundImages.length < index) {
                backgroundImages.push(null);
            }
            backgroundImages[index] = img;
        }

        public isObstacle(col: number, row: number) {
            if (!this.enabled) return false;
            if (!this.isInBounds(col, row)) return true;

            let t = cells[coordToIndex(col, row)];
            //return false;
            return t != BackgroundImageTypes.Floor;
        }

        /**
         * Renders the cells onto the screen
         */
        __draw(camera: scene.Camera): void {
            if (!this.enabled) return;

            for (let x: number = 0; x < WIDTH; x++) {
                for (let y: number = 0; y < HEIGHT; y++) {
                    screen.drawImage(backgroundImages[cells[coordToIndex(x, y)]]
                        , PADDING_LEFT + (x * CELL_SIZE)
                        , PADDING_TOP + (y * CELL_SIZE));
                }
            }

        }

        private isInBounds(col: number, row: number): boolean {
            return !(col < 0 || col >= this.WIDTH - 0
                || row < 0 || row >= this.HEIGHT - 0);
        }
    }
}