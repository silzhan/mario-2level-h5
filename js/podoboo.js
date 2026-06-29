class Podoboo {
    constructor(x, lavaY, topY) {
        this.x = x;
        this.lavaY = lavaY;
        this.topY = topY;
        this.y = lavaY;
        this.width = 16;
        this.height = 16;
        this.velY = 0;
        this.alive = true;
        this.state = 'waiting';
        this.waitTimer = Math.floor(Math.random() * 60);
        this.sinkTimer = 0;
    }

    update() {
        if (!this.alive) return;

        if (this.state === 'waiting') {
            this.waitTimer--;
            if (this.waitTimer <= 0) {
                this.state = 'rising';
                this.velY = -8;
            }
        } else if (this.state === 'rising') {
            this.y += this.velY;
            this.velY += CONFIG.GRAVITY * 0.8;
            if (this.y <= this.topY) {
                this.y = this.topY;
                this.velY = 0;
                this.state = 'falling';
                this.sinkTimer = 20;
            }
        } else if (this.state === 'falling') {
            this.velY += CONFIG.GRAVITY * 0.8;
            this.y += this.velY;
            if (this.y >= this.lavaY) {
                this.y = this.lavaY;
                this.velY = 0;
                this.state = 'waiting';
                this.waitTimer = 40 + Math.floor(Math.random() * 40);
            }
        }
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}