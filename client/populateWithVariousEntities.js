export {
    populateWithVariousEntities
}
import { Player } from "./Player.js";
import { Wall } from "./Wall.js";
import { Projectile } from "./projectile.js";
import { Forcefield } from "./Forcefield.js";

function populateWithVariousEntities() {
    globalThis.thePlayer = new Player({ keyboard, x: 50, y: 50, width: 10, height: 10 });
    globalThis.game.addEntity(globalThis.thePlayer);
    const playerForcefield = new Forcefield({ entityThatGeneratesIt: globalThis.thePlayer });
    globalThis.game.addEntity(playerForcefield);

    const projectile = new Projectile({ x: 300, y: 50, width: 4, height: 4 });
    projectile.velocityX = projectile.speedX * -1;
    globalThis.game.addEntity(projectile);

    const leftWall = new Wall({ x: 0, y: 0, width: 20, height: globalThis.gameWorldHeight });
    const topWall = new Wall({ x: 20, y: 0, width: -20 + globalThis.gameWorldWidth, height: 20 });
    const bottomWall = new Wall({ x: 20, y: globalThis.gameWorldHeight, width: -20 + globalThis.gameWorldWidth, height: 20 });
    const rightWall = new Wall({ x: -20 + globalThis.gameWorldWidth, y: 20, width: 20, height: globalThis.gameWorldHeight });
    const thinWall = new Wall({ x: 100, y: 100, width: 1, height: 10 });
    const thinWall2 = new Wall({ x: 110, y: 100, width: 1, height: 10 });
    const thinWall3 = new Wall({ x: 50, y: 100, width: 1, height: 10 });
    const thickerWall = new Wall({ x: 120, y: 120, width: 10, height: 20 });
    globalThis.game.addEntity(leftWall);
    globalThis.game.addEntity(topWall);
    globalThis.game.addEntity(bottomWall);
    globalThis.game.addEntity(rightWall);
    globalThis.game.addEntity(thinWall);
    globalThis.game.addEntity(thinWall2);
    globalThis.game.addEntity(thinWall3);
    globalThis.game.addEntity(thickerWall);
}

