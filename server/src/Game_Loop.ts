import { EmitStuff } from "#root/World_State_Emission_Stuff/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";

export { Game_Loop }

class Game_Loop {
  static tickRate = 12; // Updates per second
  static msPerTick = 1000 / Game_Loop.tickRate; // Duration of each update in milliseconds
  static deltaTime = Game_Loop.msPerTick;
  static lastUpdateTime = Date.now();
  static accumulatedTime = 0;

  static theLoop() {
    const currentTime = Date.now();
    const elapsed = currentTime - Game_Loop.lastUpdateTime;
    Game_Loop.lastUpdateTime = currentTime;

    Game_Loop.accumulatedTime += elapsed;

    // Process game logic in fixed-size steps
    while (Game_Loop.accumulatedTime >= Game_Loop.msPerTick) {
      Game_Loop.updateGameState();
      Game_Loop.accumulatedTime -= Game_Loop.msPerTick;
    }

    // Schedule the next iteration
    setImmediate(Game_Loop.theLoop); // More precise than setTimeout in Node.js
  }

  static updateGameState() {
    EntitySorter.Sort_All_Entities_In_Order_Of_Appearance_For_The_Top_Down_Camera();
    EmitStuff.Emit_To_All_Players_World_State_Stuff();
    Game_Loop.Update_States_Of_All_Entities();
  }

  static Update_States_Of_All_Entities() {
    World.getCurrentEntities().forEach(entity => {
      entity.updateStateWrapper();
    });
  }

}