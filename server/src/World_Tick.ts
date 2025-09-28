import { EmitStuff } from "#root/World_State_Emission_Stuff/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";
import { newLog } from "#root/My_Log.js"

export { World_Tick }

class Stopwatch {
  static startTime=0;
  static totalLapsTime=0;
  static start() {
    this.startTime = this.getCurrentTimeInMs();
    this.totalLapsTime = 0;
  }
  static lap() {
    const currTime = this.getCurrentTimeInMs();
    const elapsed = currTime - this.startTime;
    this.totalLapsTime += elapsed;
    return elapsed;
  }
  static getCurrentTimeInMs() {
    return Date.now();
  }
  static total() {
    return this.totalLapsTime;
  }
}

class World_Tick {
  static tickRate = 20; // Updates per second
  static msPerTick = 1000 / World_Tick.tickRate; // Duration of each update in milliseconds
  static deltaTime = World_Tick.msPerTick;
  static lastUpdateTime = Date.now();
  static accumulatedTime = 0;
  static started = true;
 static emitEveryMs= 50;
 static lastEmitTime =0;
 static tickCount=0;
 
  static beginTicking() {
      this.tictac();
}
static tictac() {
      World_Tick.tick();
      // Schedule the next tick
     setTimeout(World_Tick.tictac, World_Tick.deltaTime); 
}
static tick() {
  newLog({logCategory:
    "World_Tick",message:`Tick #${this.tickCount}`}
    )
    this.tickCount++;
    
    const currentTime = Date.now();
    const elapsed = currentTime - World_Tick.lastUpdateTime;
    World_Tick.lastUpdateTime = currentTime;

    World_Tick.accumulatedTime += elapsed;
   newLog({
     logCategory:"World_Tick",
     message:`accumulatedTime=${World_Tick.accumulatedTime}`
   })
    // Process game logic in fixed-size steps
    while (World_Tick.accumulatedTime >= World_Tick.msPerTick) {
      World_Tick.simulateNextMoment();
      World_Tick.accumulatedTime -= World_Tick.msPerTick;
    }
  }

  static simulateNextMoment() {
   Stopwatch.start();
    World_Tick.Next_Moment_Of_All_Entities();
    newLog({
      logCategory:"World_Tick",
      message:`Next_Moment_Of_All_Entities took ${Stopwatch.lap()} milliseconds`
    })
    World_Tick.Collision_Resolutor();
       newLog({
      logCategory:"World_Tick",
      message:`Collision_Resolutor took ${Stopwatch.lap()} milliseconds`
    })
    World_Tick.Update_Positions_Of_All_Entities();
        newLog({
      logCategory:"World_Tick",
      message:`Update_Positions_Of_All_Entities took ${Stopwatch.lap()} milliseconds`
    })
    World_Tick.Clean_Up();
        newLog({
      logCategory:"World_Tick",
      message:`Clean_Up took ${Stopwatch.lap()} milliseconds`
    })
    World_Tick.Emit_To_Players();
        newLog({
      logCategory:"World_Tick",
      message:`Emit_To_Players took ${Stopwatch.lap()} milliseconds`
    })
        newLog({
      logCategory:"World_Tick",
      message:`simulateNextMoment as a whole took ${Stopwatch.total()} milliseconds`
    })

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