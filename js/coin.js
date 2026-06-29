class Coin {
    constructor(x, y, isPopCoin) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.collected = false;
        this.isPopCoin = isPopCoin || false;
        this.animTimer = 0;
        this.animFrame = 0;
    }

    update() {
        this.animTimer++;
        if (this.animTimer % 8 === 0) {
            this.animFrame = (this.animFrame + 1) % 3;
        }
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}