
class GameLoop {
    game;
    constructor({game}) {
        this.game = game;
    }
    start() {
        this.tick(0);
    }
    tick(timestamp) {
        this.game.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.tick({timestamp});
        requestAnimationFrame((timestamp) => this.tick(timestamp));
    }
}

export {
    GameLoop
}