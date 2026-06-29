class FireBar {
    constructor(cx, cy, numBalls, radius, speed, clockwise) {
        this.cx = cx;
        this.cy = cy;
        this.numBalls = numBalls || 5;
        this.radius = radius || 64;
        this.speed = speed || 0.03;
        this.clockwise = clockwise !== undefined ? clockwise : true;
        this.angle = 0;
        this.ballSize = 10;
    }

    update() {
        this.angle += this.speed * (this.clockwise ? 1 : -1);
    }

    getBallBounds(index) {
        const theta = this.angle + (index / this.numBalls) * Math.PI * 2;
        const bx = this.cx + Math.cos(theta) * this.radius - this.ballSize / 2;
        const by = this.cy + Math.sin(theta) * this.radius - this.ballSize / 2;
        return { x: bx, y: by, width: this.ballSize, height: this.ballSize };
    }
}