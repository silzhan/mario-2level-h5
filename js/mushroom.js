class Mushroom {
    constructor(x, y, type, isUnderwater) {
        this.type = type || 'super';
        this.x = x + 2;
        this.y = y;
        this.targetY = y - CONFIG.TILE_SIZE;
        this.width = 28;
        this.height = 28;
        this.velX = (this.type === 'star') ? 2.5 : 1.5;
        this.velY = 0;
        this.alive = true;
        this.emerging = true;
        this.emergeProgress = 0;
        this.emergeSpeed = 0.5;
        this.onGround = false;
        this.starBounce = (this.type === 'star');
        this.isUnderwater = isUnderwater || false;
    }

    update(tiles) {
        if (this.emerging) {
            this.emergeProgress += this.emergeSpeed;
            this.y = this.targetY + CONFIG.TILE_SIZE * (1 - Math.min(1, this.emergeProgress));
            if (this.emergeProgress >= 1) { this.y = this.targetY; this.emerging = false; }
            return true;
        }

        // Underwater physics: slow horizontal + float upward
        if (this.isUnderwater) {
            this.x += this.velX * 0.5; // slower horizontally
            this.velY += CONFIG.WATER_GRAVITY - 0.06; // net upward buoyancy
            if (this.velY > 2) this.velY = 2;
            if (this.velY < -2) this.velY = -2;
            this.y += this.velY;

            // Don't go above water surface
            if (this.y < 30) { this.y = 30; this.velY = 0; }

            // Bounce off bottom
            if (this.y > 12 * CONFIG.TILE_SIZE) { this.y = 12 * CONFIG.TILE_SIZE; this.velY = -0.5; }

            // Horizontal collision
            for (const tile of tiles) {
                if (!this.isSolid(tile.type)) continue;
                if (this.collides(this, tile)) {
                    if (this.velX > 0) this.velX = -Math.abs(this.velX);
                    else this.velX = Math.abs(this.velX);
                }
            }
        } else {
            // Normal land physics
            this.x += this.velX;
            this.velY += CONFIG.GRAVITY;
            if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;
            this.y += this.velY;
            this.onGround = false;

            for (const tile of tiles) {
                if (!this.isSolid(tile.type)) continue;
                const feetY = this.y + this.height;
                const prevFeetY = feetY - this.velY;
                if (this.velY >= 0 && prevFeetY <= tile.y + 1 && feetY >= tile.y) {
                    if (this.x + this.width > tile.x && this.x < tile.x + tile.width) {
                        this.y = tile.y - this.height;
                        this.velY = 0;
                        this.onGround = true;
                        if (this.starBounce) { this.velY = -8; this.onGround = false; }
                    }
                }
                if (this.collides(this, tile)) {
                    if (this.velY > 0) { this.y = tile.y - this.height; this.velY = 0; this.onGround = true; }
                    if (this.velX > 0 && this.x + this.width > tile.x && this.x < tile.x) this.velX = -this.velX;
                    else if (this.velX < 0 && this.x < tile.x + tile.width && this.x + this.width > tile.x + tile.width) this.velX = -this.velX;
                }
            }
        }

        if (this.y > 15 * CONFIG.TILE_SIZE) this.alive = false;
        return true;
    }

    isSolid(tileType) { return isSolidTile(tileType); }
    collides(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
}