class BubbleParticle {
    constructor() {
        this.alive = true;
        this.x = Math.random() * CONFIG.SCREEN_WIDTH;
        this.y = CONFIG.SCREEN_HEIGHT + 20;
        this.size = 2 + Math.random() * 4;
        this.speed = 0.3 + Math.random() * 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02 + Math.random() * 0.02;
        this.wobbleAmount = Math.random() * 15;
        this.alpha = 0.15 + Math.random() * 0.15;
    }

    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.3;
        if (this.y < -20) this.alive = false;
    }

    getBounds() {
        return { x: this.x - this.size, y: this.y - this.size, width: this.size * 2, height: this.size * 2 };
    }
}

class BubbleSystem {
    constructor(maxBubbles = 15) {
        this.bubbles = [];
        this.maxBubbles = maxBubbles;
    }

    update() {
        // Spawn new bubbles randomly
        if (this.bubbles.length < this.maxBubbles && Math.random() < 0.08) {
            this.bubbles.push(new BubbleParticle());
        }

        // Update existing bubbles
        this.bubbles = this.bubbles.filter(b => {
            b.update();
            return b.alive;
        });
    }

    getBubbles() {
        return this.bubbles;
    }
}