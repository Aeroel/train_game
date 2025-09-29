import { EmitStuff } from "#root/World_State_Emission_Stuff/EmitStuff.js";
import { EntitySorter } from "#root/EntitySorter.js";
import { World } from "#root/World.js";
import { newLog } from "#root/My_Log.js"
import { Stopwatch } from "#root/Utilities/Stopwatch.js"
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
 static tickId=0;
 
  static beginTicking() {
      this.tictac();
}
static tictac() {
      World_Tick.tick();
 
}
static tick() {
  newLog({logCategory:
  "World_Tick",message:`[#${World_Tick.tickId}] Tick starting`}
    )
  newLog({logCategory:
  "World_Tick",message:`[#${World_Tick.tickId}] Count entities: ${World.getCurrentEntities().length}`}
    )
  
    
    const startTime = Date.now();

      World_Tick.simulateNextMoment();
      const endTime = Date.now();
          const elapsed = endTime - startTime;
            newLog({
      logCategory:"World_Tick",
      message:`[#${World_Tick.tickId}] Took ${elapsed} milliseconds`
    })
             World_Tick.tickId++;
           // Schedule the next tick
     setTimeout(World_Tick.tick, 5); 

  }
static getTickIdStr() {
  return `#${World_Tick.tickId}`
}
  static simulateNextMoment() {
    const stopwatch = new Stopwatch();
   stopwatch.beginMeasure({tags:["World_Tick",
   `${World_Tick.getTickIdStr()}`, "Next_Moment_Of_All_Entities"]});
    World_Tick.Next_Moment_Of_All_Entities();
   stopwatch.endMeasure();
   
      stopwatch.beginMeasure({tags:["World_Tick",    `${World_Tick.getTickIdStr()}`, "Collision_Resolutor"]});
    World_Tick.Collision_Resolutor();
   stopwatch.endMeasure();

 
      stopwatch.beginMeasure({tags:["World_Tick",    `${World_Tick.getTickIdStr()}`, "Update_Positions_Of_All_Entities"]});
    World_Tick.Update_Positions_Of_All_Entities();
   stopwatch.endMeasure();
   
   
      stopwatch.beginMeasure({tags:["World_Tick",   `${World_Tick.getTickIdStr()}`, "Clean_Up"]});
    World_Tick.Clean_Up();
    stopwatch.endMeasure();

   stopwatch.beginMeasure({tags:["World_Tick",   `${World_Tick.getTickIdStr()}`, "Emit_To_Players"]});
    World_Tick.Emit_To_Players();
    stopwatch.endMeasure();

  }

  static Next_Moment_Of_All_Entities() {

   const nextMomentMainTags = ["World_Tick",
   `${World_Tick.getTickIdStr()}`,
  "Next_Moment_Of_All_Entities"];
  const measures: {entityClassName: string, ms: number}[] =[];
      const stopwatch = new Stopwatch();
    
    World.getCurrentEntities().forEach(entity => {
      stopwatch.beginMeasure({tags:[...nextMomentMainTags, `${entity.id}` ]})
      entity.updateState();
      measures.push({entityClassName: entity.constructor.name, ms: stopwatch.lap()})
    });
    
    let maxTime = 0;
    let slowestEntity: string | null = null;
    
    for (const measure of measures) {
        if (measure.ms > maxTime) {
            maxTime = measure.ms;
            slowestEntity = measure.entityClassName;
        }
    }
    
     const totalMs = measures.reduce((sum, measure) => sum + measure.ms, 0);
    const averageMs = measures.length > 0 ? totalMs / measures.length : 0;
    
    const slowestInfo = slowestEntity 
        ? `Slowest entity: ${slowestEntity} (${maxTime} ms)`
        : "No entities to measure";
    
    const averageInfo = `Average ms per entity: ${averageMs.toFixed(0)}`;
    newLog({
      logCategory:"World_Tick",
      message: `[${World_Tick.getTickIdStr()}] [Next_Moment_Of_All_Entities] ${averageInfo}`
    })
    newLog({
      logCategory:"World_Tick",
      message: `[${World_Tick.getTickIdStr()}] [Next_Moment_Of_All_Entities] ${slowestInfo}`
    })

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