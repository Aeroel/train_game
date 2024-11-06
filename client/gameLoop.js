
class GameLoop {
    game;
    constructor({game}) {
        this.game = game;
    }
    start() {
        globalThis.lastTime = 0;
        globalThis.timestamp = 0;
        globalThis.deltaTime = 0;
        this.tick(globalThis.timestamp);
    }
    tick(timestamp) {
        globalThis.deltaTime = timestamp - globalThis.lastTime;
        globalThis.lastTime = timestamp;
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