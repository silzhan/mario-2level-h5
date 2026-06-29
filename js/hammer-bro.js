class HammerBro {
    constructor(x, y) {
        this.type = 'hammerbro';
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 38;
        this.velX = -0.8;
        this.velY = 0;
        this.alive = true;
        this.facingRight = false;
        this.onGround = true;
        this.animTimer = 0;
        this.jumpTimer = 0;
        this.jumpInterval = 100;
        this.throwTimer = 0;
        this.throwInterval = 60;
        this.pendingHammer = null;
    }

    setFacing(playerX) {
        this.facingRight = playerX > this.x;
    }

    update(tiles) {
        if (!this.alive) return false;
        this.animTimer++;

        this.throwTimer++;
        if (this.throwTimer >= this.throwInterval) {
            this.throwTimer = 0;
            this.throwInterval = 50 + Math.floor(Math.random() * 40);
            const hx = this.facingRight ? this.x + this.width : this.x - 12;
            this.pendingHammer = new HammerProjectile(hx, this.y + 5, this.facingRight);
        }

        this.onGround = false;
        this.velY += CONFIG.GRAVITY;
        if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;

        this.x += this.velX;
        this.resolveTileCollisionX(tiles);
        this.y += this.velY;
        this.resolveTileCollisionY(tiles);

        this.jumpTimer++;
        if (this.jumpTimer >= this.jumpInterval && this.onGround) {
            this.velY = -9;
            this.onGround = false;
            this.jumpTimer = 0;
            this.jumpInterval = 120 + Math.floor(Math.random() * 60);
        }

        if (this.y > 15 * CONFIG.TILE_SIZE + 64) return false;
        return true;
    }

    squish() {
        this.alive = false;
        return 'squish';
    }

    resolveTileCollisionX(tiles) {
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(this.getBounds(), tile)) {
                if (this.velX > 0) this.x = tile.x - this.width;
                else this.x = tile.x + tile.width;
                this.velX = -this.velX;
            }
        }
    }

    resolveTileCollisionY(tiles) {
        const bounds = this.getBounds();
        for (const tile of tiles) {
            if (!isSolidTile(tile.type)) continue;
            if (this.collides(bounds, tile)) {
                if (this.velY > 0) { this.y = tile.y - this.height; this.velY = 0; this.onGround = true; }
                else if (this.velY < 0) this.y = tile.y + tile.height;
            }
        }
    }

    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
    collides(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
}

class HammerProjectile {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = 14;
        this.height = 14;
        this.velX = facingRight ? 4 : -4;
        this.velY = -6 + Math.random() * -2;
        this.alive = true;
        this.animTimer = 0;
    }

    update() {
        if (!this.alive) return false;
        this.animTimer++;
        this.velY += CONFIG.GRAVITY * 0.8;
        this.x += this.velX;
        this.y += this.velY;
        this.x += Math.sin(this.animTimer * 0.3) * 0.5;
        if (this.y > 15 * CONFIG.TILE_SIZE) this.alive = false;
        return true;
    }

    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
}