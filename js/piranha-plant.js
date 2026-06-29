class PiranhaPlant {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.x = col * CONFIG.TILE_SIZE + 4;
        this.y = (row + 1) * CONFIG.TILE_SIZE;
        this.width = 24;
        this.height = 28;
        this.alive = true;
        this.state = 'hidden';
        this.timer = 0;
        this.showDuration = 60;
        this.hideDuration = 80;
        this.extendSpeed = 1.5;
        this.currentExtend = 0;
        this.maxExtend = CONFIG.TILE_SIZE * 1.5;
    }

    update(playerX, playerY) {
        if (!this.alive) return;
        this.timer++;

        const px = this.col * CONFIG.TILE_SIZE;
        const dist = Math.abs(playerX - px);

        if (dist < CONFIG.SCREEN_WIDTH * 0.6) {
            if (this.state === 'hidden' && this.timer > this.hideDuration) {
                this.state = 'extending';
                this.timer = 0;
            }
        } else {
            if (this.state !== 'hidden') {
                this.state = 'retracting';
            }
        }

        if (this.state === 'extending') {
            this.currentExtend += this.extendSpeed;
            if (this.currentExtend >= this.maxExtend) {
                this.currentExtend = this.maxExtend;
                this.state = 'visible';
                this.timer = 0;
            }
        } else if (this.state === 'visible') {
            if (this.timer > this.showDuration) {
                this.state = 'retracting';
                this.timer = 0;
            }
        } else if (this.state === 'retracting') {
            this.currentExtend -= this.extendSpeed;
            if (this.currentExtend <= 0) {
                this.currentExtend = 0;
                this.state = 'hidden';
                this.timer = 0;
            }
        }
    }

    getBounds() {
        if (this.state === 'hidden') return null;
        return {
            x: this.x,
            y: this.y - this.currentExtend,
            width: this.width,
            height: this.currentExtend
        };
    }
}