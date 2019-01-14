/**
 * A physics engine that does simple AABB bounding box check
 */
class CalmerManPhysicsEngine extends PhysicsEngine {
    protected sprites: Sprite[];
    protected map: sprites.SpriteMap;
    protected tm: tiles.CalmerManTileMap;

    constructor() {
        super();
        this.sprites = [];
        this.tm = new tiles.CalmerManTileMap();
        this.tm.setMap(img`
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 . . . . . . . . . . . . . 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        `);
        this.tm.setTile(1, img`
            1
        `, true);
    }

    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
    }

    removeSprite(sprite: Sprite) {
        this.sprites.removeElement(sprite);
    }

    draw() {

    }

    move(dt: number) {
        const dtf = Fx.min(MAX_TIME_STEP, Fx8(dt))
        const dt2 = Fx.idiv(dtf, 2)

        const tm = game.currentScene().tileMap;

        for (let s of this.sprites) {
            const ovx = constrain(s._vx);
            const ovy = constrain(s._vy);

            s._vx = constrain(Fx.add(s._vx, Fx.mul(s._ax, dtf)))
            s._vy = constrain(Fx.add(s._vy, Fx.mul(s._ay, dtf)))

            this.moveSprite(s, tm,
                Fx.mul(Fx.add(s._vx, ovx), dt2),
                Fx.mul(Fx.add(s._vy, ovy), dt2))
        }
    }

    collisions() {
        control.enablePerfCounter("phys_collisions")


    }

    /**
     * Returns sprites that overlap with the given sprite. If type is non-zero, also filter by type.
     * @param sprite
     * @param layer
     */
    overlaps(sprite: Sprite): Sprite[] {
        if (this.map)
            return this.map.overlaps(sprite);
        else {
            // brute force
            const layer = sprite.layer;
            const r: Sprite[] = [];
            const n = this.sprites.length;
            for (let i = 0; i < n; ++i) {
                if ((layer & this.sprites[i].layer)
                    && sprite.overlapsWith(this.sprites[i]))
                    r.push(this.sprites[i]);
            }
            return r;
        }
    }

    public moveSprite(s: Sprite, tm: tiles.TileMap, dx: Fx8, dy: Fx8) {
        if (dx === Fx.zeroFx8 && dy === Fx.zeroFx8) {
            s._lastX = s._x;
            s._lastY = s._y;
            return;
        }

        if (this.tm && this.tm.enabled && !(s.flags & sprites.Flag.Ghost)) {

            const currTileX = Math.idiv((s.x - this.tm.PADDING_LEFT), 10);
            const currTileY = Math.idiv((s.y - this.tm.PADDING_TOP), 10);

            const relX = (s.x - this.tm.PADDING_LEFT) % 10;
            const relY = (s.y - this.tm.PADDING_TOP) % 10;


            const PADDING_RANGE = 4; // Must be less than half of cell size (5)

            if (dy !== Fx.zeroFx8) {
                if (relX < 5 && relX > 5 - PADDING_RANGE) {
                    dx = Fx.min(Fx8(5 - relX), Fx.abs(dy));
                } else if (relX > 5 && relX < 5 + PADDING_RANGE) {
                    dx = Fx.neg(Fx.min(Fx8(relX - 5), Fx.abs(dy)));
                }
            }

            if (dx !== Fx.zeroFx8) {
                if (relY < 5 && relY > 5 - PADDING_RANGE) {
                    dy = Fx.min(Fx8(5 - relY), Fx.abs(dx));
                } else if (relY > 5 && relY < 5 + PADDING_RANGE) {
                    dy = Fx.neg(Fx.min(Fx8(relY - 5), Fx.abs(dx)));
                }
            }

            const top = Math.idiv((s.top - this.tm.PADDING_TOP), 10);
            const bottom = Math.idiv((s.bottom - this.tm.PADDING_TOP), 10);
            const left = Math.idiv((s.left - this.tm.PADDING_LEFT), 10);
            const right = Math.idiv((s.right - this.tm.PADDING_LEFT), 10);

            const newTop = Math.idiv((s.top + Fx.toInt(dy) - this.tm.PADDING_TOP), 10);
            const newBottom = Math.idiv((s.bottom - 1 + Fx.toInt(dy) - this.tm.PADDING_TOP), 10);
            const newLeft = Math.idiv((s.left + Fx.toInt(dx) - this.tm.PADDING_LEFT), 10);
            const newRight = Math.idiv((s.right - 1 + Fx.toInt(dx) - this.tm.PADDING_LEFT), 10);


            if (dx > Fx.zeroFx8) {
                if (this.tm.isObstacle(newRight, newTop) || this.tm.isObstacle(newRight, newBottom)) {
                    dx = Fx8((newRight * 10 + this.tm.PADDING_LEFT) - Math.round(s.right));
                }
            } else if (dx < Fx.zeroFx8) {
                if (this.tm.isObstacle(newLeft, newTop) || this.tm.isObstacle(newLeft, newBottom)) {
                    dx = Fx8(((newLeft + 1) * 10 + this.tm.PADDING_LEFT) - Math.round(s.left));
                }
            }

            if (dy > Fx.zeroFx8) {
                if (this.tm.isObstacle(newLeft, newBottom) || this.tm.isObstacle(newRight, newBottom)) {
                    dy = Fx8((newBottom * 10) + this.tm.PADDING_TOP - (Fx.toInt(s._y) + 10));
                }
            } else if (dy < Fx.zeroFx8) {
                if (this.tm.isObstacle(newLeft, newTop) || this.tm.isObstacle(newRight, newTop)) {
                    dy = Fx8(((newTop + 1) * 10) + this.tm.PADDING_TOP - Math.round(s.top));
                }
            }
        }

        s._lastX = s._x;
        s._lastY = s._y;
        s._x = Fx.add(s._x, dx);
        s._y = Fx.add(s._y, dy);
    }
}