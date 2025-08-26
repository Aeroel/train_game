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
  if(!(collision.info.occurred)) {
    return;
  } 
  
  const dt = World_Tick.deltaTime;
  const beforeCollisonTime = (collision.info.time - 0.01) * dt;
  
  const otherEntity = closestCollision.entityB;
 
  const Pushable_Position_Just_Before_Collision = {
    x: pushableEntity.x + (pushableEntity.vx * beforeCollisonTime ),
    y: pushableEntity.y + (pushableEntity.vy * beforeCollisonTime),
  }; 
  const otherJustBefore = {
    x: otherEntity.x + (otherEntity.vx * beforeCollisonTime),
    y: otherEntity.y + (otherEntity.vy * beforeCollisonTime),
  }; 
   

    if(recursionTimes >6) {
         throw new Error(`${recursionTimes}`)
    }

   this.actualResolve({pushableEntity, recursionTimes: recursionTimes++});
  }


}
