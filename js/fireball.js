class Fireball {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.velX = facingRight ? 5 : -5;
        this.velY = 0;
        this.alive = true;
        this.animTimer = 0;
        this.bounces = 0;
        this.maxBounces = 4;
    }

    update(tiles, isUnderwater) {
        if (!this.alive) return false;
        this.animTimer++;

        if (isUnderwater) {
            // Underwater: no gravity, slower
            this.x += this.velX * 0.8;
        } else {
            this.x += this.velX;
            this.velY += CONFIG.GRAVITY * 0.6;
            if (this.velY > 6) this.velY = 6;
            this.y += this.velY;
        }

        // Tile collision
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(this.getBounds(), tile)) {
                if (!isUnderwater) {
                    if (this.velY > 0) {
                        this.y = tile.y - this.height;
                        this.velY = -6;
                        this.bounces++;
                        if (this.bounces >= this.maxBounces) { this.alive = false; return false; }
                    } else {
                        this.alive = false;
                        return false;
                    }
                } else {
                    this.alive = false;
                    return false;
                }
            }
        }

        if (this.x < -50 || this.x > 5000) { this.alive = false; return false; }
        if (this.y > 15 * CONFIG.TILE_SIZE) { this.alive = false; return false; }

        return true;
    }

    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
    collides(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
}