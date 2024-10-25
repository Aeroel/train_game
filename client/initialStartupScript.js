import { KeyboardInput } from "./KeyboardInput.js";
import { GameLoop } from "./GameLoop.js";
import { Game } from "./Game.js";
import { populateWithVariousEntities } from "./populateWithVariousEntities.js";

globalThis.gameCanvasWidth = 1280;
globalThis.gameCanvasHeight = 720;

globalThis.gameWorldWidth = 10_000;
globalThis.gameWorldHeight = 10_000;

globalThis.keyboard = new KeyboardInput();

function initialStartupScript() {
    const canvas = document.getElementById("gameCanvas");
    const context = gameCanvas.getContext("2d");
    gameCanvas.width = gameCanvasWidth;
    gameCanvas.height = gameCanvasHeight;

    const game = new Game({ keyboard, canvas, context, xBounds: gameWorldWidth, yBounds: gameWorldHeight });
    globalThis.game = game;
    globalThis.gameEntities = game.entities;
    const gameLoop = new GameLoop({ game });
    gameLoop.start();

    populateWithVariousEntities({game});

}

export {
    initialStartupScript,
}