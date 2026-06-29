class Goomba {
    constructor(x, y) {
        this.type = 'goomba';
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.velX = -1.0;
        this.velY = 0;
        this.alive = true;
        this.onGround = false;
        this.animTimer = 0;
        this.squished = false;
        this.squishTimer = 0;
        this.facingRight = false;
    }

    update(tiles) {
        if (!this.alive) return false;
        if (this.squished) {
            this.squishTimer++;
            return this.squishTimer < 60;
        }

        this.animTimer++;
        this.onGround = false;
        this.velY += CONFIG.GRAVITY;
        if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;

        this.x += this.velX;
        this.resolveTileCollisionX(tiles);
        this.y += this.velY;
        this.resolveTileCollisionY(tiles);

        if (this.y > 15 * CONFIG.TILE_SIZE + 64) return false;
        return true;
    }

    squish() {
        this.squished = true;
        this.squishTimer = 0;
        this.height = 14;
        this.y += 14;
        this.velX = 0;
        return 'squish';
    }

    resolveTileCollisionX(tiles) {
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(this.getBounds(), tile)) {
                this.velX = -this.velX;
                this.facingRight = this.velX > 0;
                if (this.velX > 0) this.x = tile.x + tile.width;
                else this.x = tile.x - this.width;
            }
        }
    }

    resolveTileCollisionY(tiles) {
        const bounds = this.getBounds();
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(bounds, tile)) {
                if (this.velY > 0) {
                    this.y = tile.y - this.height;
                    this.velY = 0;
                    this.onGround = true;
                } else if (this.velY < 0) {
                    this.y = tile.y + tile.height;
                    this.velY = 0;
                }
            }
        }
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    collides(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }
}