
class GameLoop {
    game;
    constructor({game}) {
        this.game = game;
    }
    start() {
        this.tick(0);
    }
    tick(timestamp) {
        globalThis.context.clearRect(0, 0, globalThis.canvas.width, globalThis.canvas.height);
        this.game.tick();
        requestAnimationFrame((timestamp) => this.tick(timestamp));
    }
}

export {
    GameLoop
}