import { EmitStuff } from "#root/World_State_Emission_Stuff/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";

export { Game_Loop }

class Game_Loop {
  static tickRate = 20; // Updates per second
  static msPerTick = 1000 / Game_Loop.tickRate; // Duration of each update in milliseconds
  static deltaTime = Game_Loop.msPerTick;
  static lastUpdateTime = Date.now();
  static accumulatedTime = 0;
  static started = true;
 static emitEveryMs= 50;
 static lastEmitTime =0;
  static theLoop() {


    const currentTime = Date.now();
    const elapsed = currentTime - Game_Loop.lastUpdateTime;
    Game_Loop.lastUpdateTime = currentTime;

    Game_Loop.accumulatedTime += elapsed;

    // Process game logic in fixed-size steps
    while (Game_Loop.accumulatedTime >= Game_Loop.msPerTick) {
      Game_Loop.simulateNextMoment();
      Game_Loop.accumulatedTime -= Game_Loop.msPerTick;
    }

    // Schedule the next iteration
    setImmediate(Game_Loop.theLoop); // More precise than setTimeout in Node.js?
  }

  static simulateNextMoment() {

    Game_Loop.Next_Moment_Of_All_Entities();
    Game_Loop.Collision_Resolutor();
    Game_Loop.Update_Positions_Of_All_Entities();
    Game_Loop.Clean_Up();
    Game_Loop.Emit_To_Players();
  }

  static Next_Moment_Of_All_Entities() {
    World.getCurrentEntities().forEach(entity => {
      entity.updateState();
    });
  }
  static Collision_Resolutor() {
        World.getCurrentEntities().forEach(entity => {
      entity.collisionManager();
    });
  }
  static Update_Positions_Of_All_Entities() {
    
    World.getCurrentEntities().forEach(entity => {
      entity.updatePosition();
    });
    
  }
  static Clean_Up() {
        World.getCurrentEntities().forEach(entity => {
      entity.Clean_Up();
    });
  }
static  Emit_To_Players() {
        const timeToEmit = Date.now() > (this.lastEmitTime + this.emitEveryMs) 
    if(!timeToEmit) {
     return;
    }
   EmitStuff.Emit_To_All_Players_World_State_Stuff();
     this.lastEmitTime = Date.now();
    
  }
}