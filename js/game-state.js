class GameState {
    constructor() {
        this.PLAYING = 0;
        this.WIN = 1;
        this.DEAD = 2;
        this.FLAGPOLE = 3;
        this.LEVEL_TRANSITION = 4;
        this.state = this.PLAYING;

        this.currentLevel = 1;
        this.totalLevels = 4;
        this.levelScore = 0;

        // World tracking: 1 = World 2-1, etc.
        this.worldOffset = 2;
    }

    getWorldLabel() {
        return `WORLD ${this.worldOffset}-${this.currentLevel}`;
    }
}