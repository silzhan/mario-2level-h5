class Blooper {
    constructor(x, y) {
        this.type = 'blooper';
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.velX = 0;
        this.velY = 0;
        this.alive = true;
        this.animTimer = 0;
        this.facingRight = false;
        this.onGround = false;

        // Blooper AI
        this.originY = y;
        this.swimTimer = 0;
        this.swimPhase = 'patrol'; // patrol, chase, cooldown
        this.chaseTimer = 0;
        this.cooldownTimer = 0;
        this.chaseSpeed = 2.5;
        this.patrolSpeed = 1.2;
        this.lastPlayerY = y;
    }

    update(tiles, playerX, playerY) {
        if (!this.alive) return false;
        this.animTimer++;
        this.swimTimer += 0.03;

        if (this.swimPhase === 'patrol') {
            // Vertical bobbing
            this.y = this.originY + Math.sin(this.swimTimer) * 20;
            // Gentle horizontal patrol
            this.x += Math.cos(this.swimTimer * 0.5) * 0.5;
            this.facingRight = Math.cos(this.swimTimer * 0.5) > 0;

            // Check if player is close enough to chase
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.swimPhase = 'chase';
                this.chaseTimer = 30; // brief delay before charging
            }
        } else if (this.swimPhase === 'chase') {
            this.chaseTimer--;
            if (this.chaseTimer <= 0) {
                // Sudden charge toward player
                const dx = playerX - this.x;
                const dy = playerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                this.velX = (dx / dist) * this.chaseSpeed;
                this.velY = (dy / dist) * this.chaseSpeed;
                this.facingRight = this.velX > 0;

                this.swimPhase = 'cooldown';
                this.cooldownTimer = 90;
            }
        } else if (this.swimPhase === 'cooldown') {
            // Move with velocity, slowly decelerating
            this.velX *= 0.95;
            this.velY *= 0.95;
            if (Math.abs(this.velX) < 0.2) this.velX = 0;
            if (Math.abs(this.velY) < 0.2) this.velY = 0;

            this.cooldownTimer--;
            if (this.cooldownTimer <= 0) {
                this.velX = 0;
                this.velY = 0;
                this.originY = this.y;
                this.swimPhase = 'patrol';
            }
        }

        this.x += this.velX;
        this.y += this.velY;

        // Keep blooper in water boundaries
        if (this.y < 20) this.y = 20;
        if (this.y > 12 * CONFIG.TILE_SIZE) this.y = 12 * CONFIG.TILE_SIZE;
        if (this.x < -50) this.alive = false;
        if (this.x > 5000) this.alive = false;

        return true;
    }

    getBounds() {
        return { x: this.x + 2, y: this.y + 2, width: this.width - 4, height: this.height - 4 };
    }

    collides(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }
}