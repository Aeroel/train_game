import { InteractionsWithKeyboard } from "./interactionsWithKeyboard.js";
import { GameLoop } from "./gameLoop.js";
import { Game } from "./game.js";
import { Player } from "./player.js";
import { Wall } from "./wall.js";
const width = 1280;
const height = 720;

function initialStartupScript() {
    const keyboard = new InteractionsWithKeyboard();
    const canvas = document.getElementById("gameCanvas");
    const context = gameCanvas.getContext("2d");
    gameCanvas.width = width;
    gameCanvas.height = height;

    const game = new Game({ keyboard, canvas, context, xBounds: width, yBounds: height });
    const gameLoop = new GameLoop({ game });
    const player = new Player({ keyboard, x: 0, y: 0, width: 10, height: 10 });
    const wall = new Wall({ x: 100, y: 100, width: 15, height: 40 });
    game.addEntity(player);
    game.addEntity(wall);
    gameLoop.start();
}

export {
    initialStartupScript,
}