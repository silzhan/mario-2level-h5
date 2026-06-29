class CheepCheep {
    constructor(x, y, color) {
        this.type = 'cheepcheep';
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 20;
        this.velX = 0;
        this.velY = 0;
        this.alive = true;
        this.animTimer = 0;
        this.facingRight = true;

        this.color = color || 'red'; // 'red' = straight, 'gray' = wave
        this.speed = 1.5 + Math.random() * 1.0;
        this.swimTimer = Math.random() * Math.PI * 2;

        // Red fish: horizontal straight swimmer
        // Gray fish: wavy swimmer
        if (color === 'gray') {
            this.waveAmplitude = 20 + Math.random() * 15;
            this.waveFreq = 0.05 + Math.random() * 0.03;
        } else {
            this.waveAmplitude = 0;
            this.waveFreq = 0;
        }

        // Some fish come from right side
        if (x > 500) {
            this.velX = -this.speed;
            this.facingRight = false;
        } else {
            this.velX = -this.speed;
            this.facingRight = false;
        }
    }

    update(tiles) {
        if (!this.alive) return false;
        this.animTimer++;
        this.swimTimer += this.waveFreq || 0.02;

        // Horizontal movement
        this.x += this.velX;

        // Wave movement for gray fish
        if (this.color === 'gray') {
            this.y = this.y + Math.sin(this.swimTimer) * 0.5;
        } else {
            this.y += Math.sin(this.swimTimer * 0.1) * 0.3;
        }

        // Some fish spawn from right periodically
        if (this.x < -50) this.alive = false;
        if (this.x > 5000) this.alive = false;

        // Boundary checks
        if (this.y < 30) this.y = 30;
        if (this.y > 11 * CONFIG.TILE_SIZE) this.y = 11 * CONFIG.TILE_SIZE;

        return true;
    }

    getBounds() {
        return { x: this.x + 2, y: this.y + 2, width: this.width - 4, height: this.height - 4 };
    }

    collides(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }
}