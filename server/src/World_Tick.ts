import { EmitStuff } from "#root/World_State_Emission_Stuff/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";

export { World_Tick }

class World_Tick {
  static tickRate = 20; // Updates per second
  static msPerTick = 1000 / World_Tick.tickRate; // Duration of each update in milliseconds
  static deltaTime = World_Tick.msPerTick;
  static lastUpdateTime = Date.now();
  static accumulatedTime = 0;
  static started = true;
 static emitEveryMs= 50;
 static lastEmitTime =0;
 
 
  static beginTicking() {
      this.tictac();
}
static tictac() {
      World_Tick.tick();
      // Schedule the next tick
     setImmediate(World_Tick.tictac); // More precise than setTimeout in Node.js?  
}
static tick() {
    const currentTime = Date.now();
    const elapsed = currentTime - World_Tick.lastUpdateTime;
    World_Tick.lastUpdateTime = currentTime;

    World_Tick.accumulatedTime += elapsed;

    // Process game logic in fixed-size steps
    while (World_Tick.accumulatedTime >= World_Tick.msPerTick) {
      World_Tick.simulateNextMoment();
      World_Tick.accumulatedTime -= World_Tick.msPerTick;
    }
  }

  static simulateNextMoment() {

    World_Tick.Next_Moment_Of_All_Entities();
    World_Tick.Collision_Resolutor();
    World_Tick.Update_Positions_Of_All_Entities();
    World_Tick.Clean_Up();
    World_Tick.Emit_To_Players();
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
      entity.lastvx= entity.vx
      entity.lastvy= entity.vy
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