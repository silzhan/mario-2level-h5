class Mario {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 30;
        this.hitboxWidth = 16;
        this.velX = 0;
        this.velY = 0;
        this.onGround = false;
        this.facingRight = true;
        this.alive = true;
        this.score = 0;
        this.coins = 0;
        this.isBig = false;
        this.isDucking = false;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.isFire = false;
        this.isStar = false;
        this.starTimer = 0;
        this.fireballCooldown = 0;
        this.prevY = y;
        this.jumpWasPressed = false;
        this.wasOnGround = true;
        this.isJumping = false;
        this.jumpKeyReleased = true;
        this.hitTile = null;

        // === World 2: Swimming ===
        this.isSwimming = false;
        this.swimJumpHeld = false;
        this.swimTimer = 0;
    }

    becomeBig() {
        if (this.isBig) return;
        this.isBig = true;
        this.prevHeight = this.height;
        this.y -= 15;
        this.height = 45;
        this.isInvincible = true;
        this.invincibleTimer = 60;
    }

    shrink() {
        if (!this.isBig) return;
        this.isBig = false;
        this.isDucking = false;
        this.isFire = false;
        this.height = 30;
        this.y += 15;
        this.isInvincible = true;
        this.invincibleTimer = 120;
    }

    becomeFire() {
        if (!this.isBig) this.becomeBig();
        this.isFire = true;
    }

    becomeStar() {
        this.isStar = true;
        this.starTimer = 600;
    }

    update(keys, tiles, isWaterLevel = false) {
        if (!this.alive) {
            this.velY += CONFIG.GRAVITY * 0.6;
            if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;
            this.y += this.velY;
            return;
        }

        this.hitTile = null;
        this.prevY = this.y;
        this.prevHeight = this.height;

        if (this.isStar) {
            this.starTimer--;
            if (this.starTimer <= 0) this.isStar = false;
        }

        if (this.fireballCooldown > 0) this.fireballCooldown--;

        if (!keys.jump && this.jumpWasPressed) {
            this.jumpWasPressed = false;
            if (!this.isSwimming && this.velY < -4) {
                this.velY = -4;
            }
        }

        // === SWIMMING MODE ===
        if (isWaterLevel) {
            this.isSwimming = true;

            // Duck disabled in water
            this.isDucking = false;

            // Horizontal movement
            if (keys.left) {
                const speed = keys.run ? CONFIG.WATER_RUN_SPEED : CONFIG.WATER_H_SPEED;
                this.velX = -speed;
                this.facingRight = false;
            } else if (keys.right) {
                const speed = keys.run ? CONFIG.WATER_RUN_SPEED : CONFIG.WATER_H_SPEED;
                this.velX = speed;
                this.facingRight = true;
            } else {
                this.velX *= CONFIG.WATER_FRICTION;
                if (Math.abs(this.velX) < 0.1) this.velX = 0;
            }

            // Clamp horizontal speed
            if (this.velX > CONFIG.WATER_H_MAX) this.velX = CONFIG.WATER_H_MAX;
            if (this.velX < -CONFIG.WATER_H_MAX) this.velX = -CONFIG.WATER_H_MAX;

            // Swimming vertical
            const justPressed = keys.jump && !this.jumpWasPressed;
            if (justPressed) {
                this.velY = CONFIG.SWIM_UP_FORCE;
                this.jumpWasPressed = true;
                this.onGround = false;
                this.swimTimer = 10;
                if (window.music && typeof music.swim === 'function') music.swim();
            } else if (keys.jump && this.jumpWasPressed) {
                // Holding jump = gentle continuous upward
                if (this.velY > CONFIG.SWIM_HOLD_MIN) {
                    this.velY += CONFIG.SWIM_HOLD_FORCE * 0.3;
                    if (this.velY < CONFIG.SWIM_UP_FORCE * 0.5) {
                        this.velY = CONFIG.SWIM_UP_FORCE * 0.5;
                    }
                }
            } else {
                this.jumpWasPressed = false;
            }

            if (this.swimTimer > 0) this.swimTimer--;

            // Gravity in water (much weaker)
            this.velY += CONFIG.WATER_GRAVITY;
            if (this.velY > CONFIG.WATER_MAX_FALL) this.velY = CONFIG.WATER_MAX_FALL;

            this.onGround = false;

            // Move horizontally
            this.x += this.velX;
            this.resolveTileCollisionX(tiles, true);

            // Move vertically
            this.y += this.velY;
            this.resolveTileCollisionY(tiles, true);

            if (this.x < 0) this.x = 0;

            // Top boundary - can swim up to top of screen
            if (this.y < 0) {
                this.y = 0;
                this.velY = 0;
            }

            this.prevY = this.y - this.velY;
            return;
        }

        // === NORMAL (LAND) MODE ===
        this.isSwimming = false;

        if (!keys.jump && this.jumpWasPressed) {
            this.jumpWasPressed = false;
            if (this.velY < -4) this.velY = -4;
        }

        // Ducking (big Mario only)
        if (keys.down && this.onGround && this.isBig && !this.isDucking) {
            this.isDucking = true;
            this.height = 30;
            this.y += 15;
        } else if (this.isDucking && (!keys.down || !this.onGround)) {
            this.isDucking = false;
            this.height = 45;
            this.y -= 15;
        }

        if (this.isDucking) {
            this.velX = 0;
        } else if (keys.left) {
            const speed = keys.run ? CONFIG.RUN_SPEED : CONFIG.PLAYER_SPEED;
            this.velX = -speed;
            this.facingRight = false;
        } else if (keys.right) {
            const speed = keys.run ? CONFIG.RUN_SPEED : CONFIG.PLAYER_SPEED;
            this.velX = speed;
            this.facingRight = true;
        } else {
            this.velX *= CONFIG.FRICTION;
            if (Math.abs(this.velX) < 0.1) this.velX = 0;
        }

        const justPressed = keys.jump && !this.jumpWasPressed;
        if (justPressed && this.onGround) {
            this.velY = CONFIG.JUMP_FORCE;
            this.onGround = false;
            this.jumpWasPressed = true;
            if (window.music) music.jump();
        }
        if (!justPressed) {
            this.jumpWasPressed = keys.jump;
        }

        this.onGround = false;
        this.velY += CONFIG.GRAVITY;
        if (this.velY > CONFIG.MAX_FALL_SPEED) this.velY = CONFIG.MAX_FALL_SPEED;

        this.x += this.velX;
        this.resolveTileCollisionX(tiles, false);

        this.y += this.velY;
        this.resolveTileCollisionY(tiles, false);

        if (this.isJumping && this.onGround && keys.jump && this.jumpKeyReleased) {
            this.velY = CONFIG.JUMP_FORCE;
            this.onGround = false;
            this.jumpWasPressed = true;
            this.jumpKeyReleased = false;
            this.isJumping = false;
        }

        this.wasOnGround = this.onGround;
        if (this.onGround && this.velY <= 0) {
            this.isJumping = false;
        } else if (!this.onGround) {
            this.isJumping = true;
        }

        if (this.x < 0) this.x = 0;
        this.prevY = this.y - this.velY;
    }

    resolveTileCollisionX(tiles, isWater) {
        const hw = this.hitboxWidth / 2;
        const cx = this.x + this.width / 2;
        const bounds = { x: cx - hw, y: this.y, width: this.hitboxWidth, height: this.height };

        for (const tile of tiles) {
            if (!this.isSolid(tile.type)) continue;

            const feetY = this.y + this.height;
            const stepHeight = feetY - tile.y;
            const hOverlap = bounds.x < tile.x + tile.width && bounds.x + bounds.width > tile.x;
            const canStepUp = hOverlap && stepHeight >= 0 && stepHeight <= 2 && this.velY >= 0;

            if (canStepUp) {
                this.y = tile.y - this.height;
                this.velY = 0;
                this.onGround = true;
            } else if (this.collidesWithTile(bounds, tile)) {
                if (this.velX > 0) {
                    this.x = tile.x - hw - (this.width - this.hitboxWidth) / 2;
                } else if (this.velX < 0) {
                    this.x = tile.x + tile.width - (this.width - this.hitboxWidth) / 2 + (this.width - this.hitboxWidth) / 2;
                    this.x = tile.x + tile.width - (this.width - this.hitboxWidth) / 2;
                }
                this.velX = 0;
            }

            bounds.x = cx - hw;
        }
    }

    resolveTileCollisionY(tiles, isWater) {
        const hw = this.hitboxWidth / 2;
        const cx = this.x + this.width / 2;
        const bounds = { x: cx - hw, y: this.y, width: this.hitboxWidth, height: this.height };

        for (const tile of tiles) {
            if (!this.isSolid(tile.type)) continue;

            const feetY = this.y + this.height;
            const prevFeetY = feetY - this.velY;
            const hOverlap = bounds.x < tile.x + tile.width && bounds.x + bounds.width > tile.x;

            // Landing check
            if (hOverlap && this.velY >= 0 && prevFeetY <= tile.y + 1 && feetY >= tile.y) {
                this.y = tile.y - this.height;
                this.velY = 0;
                this.onGround = true;
                continue;
            }

            if (this.collidesWithTile(bounds, tile)) {
                if (this.velY > 0) {
                    this.y = tile.y - this.height;
                    this.velY = 0;
                    this.onGround = true;
                } else if (this.velY < 0) {
                    if (bounds.y <= tile.y + tile.height + 2) {
                        this.y = tile.y + tile.height;
                    }
                    this.velY = 0;
                    // Hit block from below
                    if (!isWater && (tile.type === 3 || tile.type === 2 || tile.type === 14 || tile.type === 15)) {
                        this.hitTile = tile;
                    }
                } else if (this.velY === 0) {
                    this.y = tile.y - this.height;
                    this.onGround = true;
                }
            }

            bounds.y = this.y;
        }
    }

    isSolid(tileType) {
        return isSolidTile(tileType);
    }

    collidesWithTile(bounds, tile) {
        return bounds.x < tile.x + tile.width &&
               bounds.x + bounds.width > tile.x &&
               bounds.y < tile.y + tile.height &&
               bounds.y + bounds.height > tile.y;
    }

    getBounds() {
        const hw = this.hitboxWidth / 2;
        const cx = this.x + this.width / 2;
        return {
            x: cx - hw,
            y: this.y,
            width: this.hitboxWidth,
            height: this.height
        };
    }
}