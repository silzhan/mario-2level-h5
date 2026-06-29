class PipeSystem {
    constructor() {
        this.active = false;
        this.movingDown = false;
        this.targetY = 0;
        this.pipeTimer = 0;
        this.exitX = 0;
        this.exitY = 0;
    }

    setup(level) {
        // No pipe entry in World 2 levels (simplified)
        this.pipes = [];
    }

    checkEntry(player, keys) {
        // No pipe entry in World 2
    }

    isActive() { return false; }

    update(player) {}
}