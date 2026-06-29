class LiftPlatform {
    constructor(x, y, widthTiles, moveType, params) {
        this.width = widthTiles * CONFIG.TILE_SIZE;
        this.height = 12;
        this.moveType = moveType; // 'vertical' or 'horizontal'
        this.speed = params.speed || 1.0;
        this.direction = 1;
        this.prevX = x;
        this.prevY = y;
        this.x = x;
        this.y = y;
        this.platformColor = params.color || '#aa8833';

        if (moveType === 'vertical') {
            this.minY = params.minY !== undefined ? params.minY : y;
            this.maxY = params.maxY !== undefined ? params.maxY : y + 3 * CONFIG.TILE_SIZE;
        } else {
            this.minX = params.minX !== undefined ? params.minX : x;
            this.maxX = params.maxX !== undefined ? params.maxX : x + 4 * CONFIG.TILE_SIZE;
        }
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        if (this.moveType === 'vertical') {
            this.y += this.speed * this.direction;
            if (this.y >= this.maxY) { this.y = this.maxY; this.direction = -1; }
            if (this.y <= this.minY) { this.y = this.minY; this.direction = 1; }
        } else {
            this.x += this.speed * this.direction;
            if (this.x >= this.maxX) { this.x = this.maxX; this.direction = -1; }
            if (this.x <= this.minX) { this.x = this.minX; this.direction = 1; }
        }
    }

    getDeltaX() { return this.x - this.prevX; }
    getDeltaY() { return this.y - this.prevY; }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    isPlayerOnTop(player) {
        const pb = player.getBounds();
        const platTop = this.y;
        const playerBottom = pb.y + pb.height;
        return pb.x + pb.width > this.x + 2 &&
               pb.x < this.x + this.width - 2 &&
               playerBottom >= platTop - 4 &&
               playerBottom <= platTop + 6 &&
               player.velY >= 0;
    }
}