import { InteractionsWithKeyboard } from "./InteractionsWithKeyboard.js";
import { GameLoop } from "./GameLoop.js";
import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { Wall } from "./Wall.js";
import { Projectile } from "./projectile.js";
globalThis.gameCanvasWidth = 1280;
globalThis.gameCanvasHeight = 720;

globalThis.gameWorldWidth = 10_000;
globalThis.gameWorldHeight = 10_000;

globalThis.keyboard = new InteractionsWithKeyboard();
globalThis.thePlayer = new Player({ keyboard, x: 50, y: 50, width: 10, height: 10 });

function initialStartupScript() {
    const canvas = document.getElementById("gameCanvas");
    const context = gameCanvas.getContext("2d");
    gameCanvas.width = gameCanvasWidth;
    gameCanvas.height = gameCanvasHeight;

    const game = new Game({ keyboard, canvas, context, xBounds: gameWorldWidth, yBounds: gameWorldHeight });
    globalThis.gameEntities = game.entities;
    const gameLoop = new GameLoop({ game });
    gameLoop.start();

    game.addEntity(globalThis.thePlayer);

    const projectile = new Projectile({x: 50, y: 50, width: 4, height: 4});
    game.addEntity(projectile)
    projectile.addMovementDirection({directionName: "right"});
    
    const leftWall = new Wall({ x: 0, y: 0, width: 20, height: globalThis.gameWorldHeight });
    const topWall = new Wall({ x: 20, y: 0, width: -20 + globalThis.gameWorldWidth, height: 20 });
    const bottomWall = new Wall({ x: 20, y: globalThis.gameWorldHeight, width: -20 + globalThis.gameWorldWidth, height: 20 });
    const rightWall = new Wall({ x: -20 + globalThis.gameWorldWidth, y: 20, width: 20, height: globalThis.gameWorldHeight });
    const thinWall = new Wall({x: 100, y:100, width:1, height:10});
    const thinWall2 = new Wall({x: 110, y:100, width:1, height:10});
    const thinWall3 = new Wall({x: 50, y:100, width:1, height:10});
    const thickerWall = new Wall({x: 120, y:120, width:10, height:20});
    game.addEntity(leftWall);
    game.addEntity(topWall);
    game.addEntity(bottomWall);
    game.addEntity(rightWall);
    game.addEntity(thinWall);
    game.addEntity(thinWall2);
    game.addEntity(thinWall3);
    game.addEntity(thickerWall);
    
}

export {
    initialStartupScript,
}