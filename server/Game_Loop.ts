import { EmitStuff } from "#root/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";

export { Game_Loop}

class Game_Loop {
    static tickRate = 50; // Updates per second
    static msPerTick = 1000 / Game_Loop.tickRate; // Duration of each update in milliseconds
    static deltaTime = Game_Loop.msPerTick / 1000; // Convert to seconds
    static lastUpdateTime = Date.now();
    static lag = 0;
  
    static theLoop() {
      const currentTime = Date.now();
      const elapsed = currentTime - Game_Loop.lastUpdateTime;
      Game_Loop.lastUpdateTime = currentTime;
  
      Game_Loop.lag += elapsed;
  
      // Process game logic in fixed-size steps
      while (Game_Loop.lag >= Game_Loop.msPerTick) {
        Game_Loop.updateGameState(); 
        Game_Loop.lag -= Game_Loop.msPerTick;
      }
  
      // Schedule the next iteration
      setImmediate(Game_Loop.theLoop); // More precise than setTimeout in Node.js
    }

    static updateGameState() {
      EntitySorter.sortAllEntitiesInOrderOfAppearanceForTheTopDownCamera();
      EmitStuff.emitToAllPlayersWorldStateStuff()
      World.getCurrentEntities().forEach(entity => {
        entity.updateState();
      })
    }
  
  }