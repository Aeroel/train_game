import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { World_Tick} from "#root/World_Tick.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"
import { Helper_Functions} from "#root/Helper_Functions.js"

/*
Todo: a better name. 
Basically, this is for player. player cannot push walls, but walls must push player. In other words, if walls move, they push. if player moves against wall, player gets stopped. 
*/
export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.actualResolve({pushableEntity})
  }
  
  
  static actualResolve({pushableEntity, recursionTimes=0}:
  {pushableEntity: Base_Entity, recursionTimes?: number}) {
  if(pushableEntity.intangibility) {
    return;
  }
  const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"));
  if(!(collision)) {
    return;
  } 
  const unpushableEntity = collision.entityB;  
  const dt = World_Tick.deltaTime;
  const  dtAtCollision = dt * collision.time;

console.log(collision.normal, dt, dtAtCollision, collision.time)

/// end
    if(recursionTimes >6) {
         throw new Error(`${recursionTimes}`)
    }
   const i = 1+recursionTimes
   this.actualResolve({pushableEntity, recursionTimes: i});
  }


}
