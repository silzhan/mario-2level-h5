class FallingPlatform {
    constructor(x, y, widthTiles) {
        this.x = x;
        this.y = y;
        this.width = widthTiles * CONFIG.TILE_SIZE;
        this.height = 12;
        this.velY = 0;
        this.alive = true;
        this.state = 'idle';
        this.shakeTimer = 0;
        this.originalY = y;
    }

    update() {
        if (this.state === 'shaking') {
            this.shakeTimer++;
            this.y = this.originalY + Math.sin(this.shakeTimer * 0.3) * 3;
            if (this.shakeTimer > 30) {
                this.state = 'falling';
                this.y = this.originalY;
            }
        } else if (this.state === 'falling') {
            this.velY += CONFIG.GRAVITY;
            this.y += this.velY;
            if (this.y > 15 * CONFIG.TILE_SIZE) this.alive = false;
        }
        return this.alive;
    }

    triggerShake() {
        if (this.state === 'idle') this.state = 'shaking';
    }

    isPlayerOnTop(player) {
        const pb = player.getBounds();
        const playerBottom = pb.y + pb.height;
        return pb.x + pb.width > this.x + 2 && pb.x < this.x + this.width - 2 &&
               playerBottom >= this.y - 4 && playerBottom <= this.y + 6 && player.velY >= 0;
    }

    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
}