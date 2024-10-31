
class GameLoop {
    game;
    constructor({game}) {
        this.game = game;
    }
    start() {
        this.tick(0);
    }
    tick(timestamp) {
        this.clearCanvas();
        this.game.tick();
        requestAnimationFrame((timestamp) => this.tick(timestamp));
    }
    clearCanvas() {
        globalThis.context.clearRect(0, 0, globalThis.canvas.width, globalThis.canvas.height);
    }
}

export {
    GameLoop
}