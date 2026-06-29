class Springboard {
    constructor(x, y, launchForce) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 20;
        this.launchForce = launchForce || -18;
        this.compressed = false;
        this.justLaunched = false;
        this.compression = 0;
        this.animTimer = 0;
    }

    compress() {
        this.compressed = true;
        this.compression = 8;
        this.justLaunched = true;
    }

    update() {
        if (this.compression > 0) {
            this.compression -= 1;
            if (this.compression <= 0) {
                this.compression = 0;
                this.compressed = false;
                this.justLaunched = false;
            }
        }
        this.animTimer++;
    }

    isPlayerOnTop(player) {
        const pb = player.getBounds();
        const playerBottom = pb.y + pb.height;
        const sbTop = this.y + (this.height - this.compression);
        return pb.x + pb.width > this.x + 2 && pb.x < this.x + this.width - 2 &&
               playerBottom >= sbTop - 4 && playerBottom <= sbTop + 6 && player.velY >= 0;
    }

    getBounds() {
        return { x: this.x, y: this.y + (this.height - this.compression), width: this.width, height: this.compression || this.height };
    }
}