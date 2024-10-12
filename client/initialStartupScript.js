import { InteractionsWithKeyboard } from "./InteractionsWithKeyboard.js";
import { GameLoop } from "./gameLoop.js";
import { Game } from "./game.js";
import { Player } from "./player.js";
import { Wall } from "./wall.js";
window.gameCanvasWidth = 1280;
window.gameCanvasHeight = 720;
window.gameWorldWidth = 10_000;
window.gameWorldHeight = 10_000;

window.keyboard = new InteractionsWithKeyboard();
window.thePlayer = new Player({ keyboard, x: 0, y: 0, width: 10, height: 10 });

function initialStartupScript() {
    const canvas = document.getElementById("gameCanvas");
    const context = gameCanvas.getContext("2d");
    gameCanvas.width = gameCanvasWidth;
    gameCanvas.height = gameCanvasHeight;

    const game = new Game({ keyboard, canvas, context, xBounds: gameWorldWidth, yBounds: gameWorldHeight });
    const gameLoop = new GameLoop({ game });
    gameLoop.start();

    game.addEntity(window.thePlayer);
    
    const leftWall = new Wall({ x: 0, y: 0, width: 20, height: window.gameWorldHeight });
    const topWall = new Wall({ x: 20, y: 0, width: -20 + window.gameWorldWidth, height: 20 });
    const bottomWall = new Wall({ x: 20, y: window.gameWorldHeight, width: -20 + window.gameWorldWidth, height: 20 });
    const rightWall = new Wall({ x: -20 + window.gameWorldWidth, y: 20, width: 20, height: window.gameWorldHeight });
    game.addEntity(leftWall);
    game.addEntity(topWall);
    game.addEntity(bottomWall);
    game.addEntity(rightWall);
    
}

export {
    initialStartupScript,
}