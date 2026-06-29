class Bowser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.velX = -1.5; // 25% faster than World 1
        this.velY = 0;
        this.alive = true;
        this.animTimer = 0;
        this.facingRight = false;
        this.onGround = true;
        this.jumpTimer = 0;
        this.jumpInterval = 120; // faster jump (1-4 was 150)
        this.fireTimer = 0;
        this.fireInterval = 150; // faster fire (1-4 was 180)
        this.fireballs = [];
        this.type = 'bowser';
        this.walkRange = { min: 0, max: 0 };
        this.falling = false;
    }

    setBridgeRange(minX, maxX) {
        this.walkRange.min = minX;
        this.walkRange.max = maxX - this.width;
    }

    update(tiles) {
        if (!this.alive) return false;
        this.animTimer++;

        if (this.falling) {
            this.velY += CONFIG.GRAVITY;
            this.y += this.velY;
            return this.y < 20 * CONFIG.TILE_SIZE;
        }

        this.velY += CONFIG.GRAVITY;
        if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;
        this.x += this.velX;
        this.facingRight = this.velX > 0;

        if (this.x <= this.walkRange.min) { this.x = this.walkRange.min; this.velX = Math.abs(this.velX); }
        else if (this.x >= this.walkRange.max) { this.x = this.walkRange.max; this.velX = -Math.abs(this.velX); }

        this.jumpTimer++;
        if (this.jumpTimer >= this.jumpInterval && this.onGround) {
            this.velY = -10;
            this.onGround = false;
            this.jumpTimer = 0;
            this.jumpInterval = 100 + Math.floor(Math.random() * 50);
        }

        this.y += this.velY;
        this.onGround = false;
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            const bounds = this.getBounds();
            if (this.collides(bounds, tile)) {
                if (this.velY > 0) { this.y = tile.y - this.height; this.velY = 0; this.onGround = true; }
            }
        }

        this.fireTimer++;
        if (this.fireTimer >= this.fireInterval) {
            this.fireTimer = 0;
            this.fireInterval = 120 + Math.floor(Math.random() * 50);
            const fbX = this.facingRight ? this.x + this.width : this.x - 16;
            const fbY = this.y + this.height / 2 - 6;
            this.fireballs.push(new BowserFireball(fbX, fbY, this.facingRight));
        }

        this.fireballs = this.fireballs.filter(fb => fb.update(tiles));
        return true;
    }

    getBounds() { return { x: this.x + 4, y: this.y + 4, width: this.width - 8, height: this.height - 4 }; }
    collides(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
    startFalling() { this.falling = true; this.velX = 0; this.velY = 0; }
}

class BowserFireball {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 12;
        this.velX = facingRight ? 5 : -5; // faster than World 1 (4)
        this.velY = 0;
        this.alive = true;
        this.animTimer = 0;
    }

    update(tiles) {
        if (!this.alive) return false;
        this.animTimer++;
        this.x += this.velX;

        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(this.getBounds(), tile)) { this.alive = false; return false; }
        }

        if (this.x < -50 || this.x > 10000) { this.alive = false; return false; }
        return true;
    }

    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
    collides(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
}