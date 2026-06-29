class InputHandler {
    constructor(canvas) {
        this.keys = {
            left: false, right: false, up: false, down: false,
            jump: false, run: false, fire: false
        };
        this.resetCallback = null;
        this.player = null;

        document.addEventListener('keydown', (e) => {
            if (!this.player || !this.player.alive) return;
            if (e.repeat) return;

            switch (e.key) {
                case 'ArrowLeft': case 'a': case 'A': this.keys.left = true; e.preventDefault(); break;
                case 'ArrowRight': case 'd': case 'D': this.keys.right = true; e.preventDefault(); break;
                case 'ArrowUp': case 'w': case 'W': this.keys.up = true; this.keys.jump = true; e.preventDefault(); break;
                case 'ArrowDown': case 's': case 'S': this.keys.down = true; e.preventDefault(); break;
                case ' ': this.keys.jump = true; e.preventDefault(); break;
                case 'Shift': case 'x': case 'X': this.keys.run = true; this.keys.fire = true; e.preventDefault(); break;
                case 'r': case 'R': if (this.resetCallback) this.resetCallback(); e.preventDefault(); break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft': case 'a': case 'A': this.keys.left = false; e.preventDefault(); break;
                case 'ArrowRight': case 'd': case 'D': this.keys.right = false; e.preventDefault(); break;
                case 'ArrowUp': case 'w': case 'W': this.keys.up = false; this.keys.jump = false; e.preventDefault(); break;
                case 'ArrowDown': case 's': case 'S': this.keys.down = false; e.preventDefault(); break;
                case ' ': this.keys.jump = false; e.preventDefault(); break;
                case 'Shift': case 'x': case 'X': this.keys.run = false; this.keys.fire = false; e.preventDefault(); break;
            }
        });
    }

    setPlayer(player) { this.player = player; }
    setResetCallback(cb) { this.resetCallback = cb; }
}