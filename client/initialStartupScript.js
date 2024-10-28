import { KeyboardInput } from "./KeyboardInput.js";
import { GameLoop } from "./GameLoop.js";
import { Game } from "./Game.js";
import { populateWithVariousEntities } from "./populateWithVariousEntities.js";

function initialStartupScript() {
    globalThis.gameCanvasWidth = 1280;
    globalThis.gameCanvasHeight = 720;

    globalThis.gameWorldWidth = 10_000;
    globalThis.gameWorldHeight = 10_000;

    globalThis.keyboard = new KeyboardInput();
    globalThis.canvas = document.getElementById("gameCanvas");
    globalThis.context = canvas.getContext("2d");

    canvas.width = gameCanvasWidth;
    canvas.height = gameCanvasHeight;

    const game = new Game({ keyboard, xLimit: gameWorldWidth, yLimit: gameWorldHeight });
    globalThis.game = game;
    globalThis.gameEntities = game.entities;
    const gameLoop = new GameLoop({ game });
    gameLoop.start();

    populateWithVariousEntities({ game });

}

export {
    initialStartupScript,
}