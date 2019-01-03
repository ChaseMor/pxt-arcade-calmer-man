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

        // 1: clear obstacles
        for (let i = 0; i < this.sprites.length; ++i)
            this.sprites[i].clearObstacles();
        /*
        // 2: refresh non-ghost collision map
        const colliders = this.sprites.filter(sprite => !(sprite.flags & sprites.Flag.Ghost));

        if (colliders.length < 10) {
            // not enough sprite, just brute force it
            this.map = undefined;
        } else {
            if (!this.map) this.map = new sprites.SpriteMap();
            this.map.update(colliders);
        }

        // 3: go through sprite and handle collisions
        const scene = game.currentScene();
        const tm = scene.tileMap;

        for (const sprite of colliders) {
            const overSprites = scene.physicsEngine.overlaps(sprite);
            for (const overlapper of overSprites) {
                // Maintaining invariant that the sprite with the higher ID has the other sprite as an overlapper
                const higher = sprite.id > overlapper.id ? sprite : overlapper;
                const lower = higher === sprite ? overlapper : sprite;

                if (higher._overlappers.indexOf(lower.id) === -1) {
                    if (sprite.overlapHandler) {
                        higher._overlappers.push(lower.id);
                        control.runInParallel(() => {
                            sprite.overlapHandler(overlapper);
                            higher._overlappers.removeElement(lower.id);
                        });
                    }

                    scene.overlapHandlers
                        .filter(h => h.kind == sprite.kind() && h.otherKind == overlapper.kind())
                        .forEach(h => {
                            higher._overlappers.push(lower.id);
                            control.runInParallel(() => {
                                h.handler(sprite, overlapper);
                                higher._overlappers.removeElement(lower.id);
                            });
                        });
                }
            }

            const xDiff = Fx.sub(sprite._x, sprite._lastX);
            const yDiff = Fx.sub(sprite._y, sprite._lastY);
            if (xDiff !== Fx.zeroFx8 || yDiff !== Fx.zeroFx8) {
                if (Fx.abs(xDiff) < MAX_DISTANCE &&
                    Fx.abs(yDiff) < MAX_DISTANCE) {
                    // Undo the move
                    sprite._x = sprite._lastX;
                    sprite._y = sprite._lastY;

                    // Now move it with the tilemap in mind
                    this.moveSprite(sprite, tm, xDiff, yDiff);
                }
            }

        }*/
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
            const top = Math.idiv((s.top - this.tm.PADDING_TOP), 10);
            const bottom = Math.idiv((s.bottom - this.tm.PADDING_TOP), 10);
            const left = Math.idiv((s.left - this.tm.PADDING_LEFT), 10);
            const right = Math.idiv((s.right - this.tm.PADDING_LEFT), 10);

            if (this.tm.isObstacle(top, left)
                || this.tm.isObstacle(top, right)
                || this.tm.isObstacle(bottom, left)
                || this.tm.isObstacle(top, right)) {
                //return;
            }

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

        s._x = Fx.add(s._x, dx);
        s._y = Fx.add(s._y, dy);
        s._lastX = s._x;
        s._lastY = s._y;
    }
}