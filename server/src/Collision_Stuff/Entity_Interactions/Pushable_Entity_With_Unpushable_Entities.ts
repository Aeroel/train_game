import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Game_Loop} from "#root/Game_Loop.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";


/*
Todo: a better name. 
Basically, this is for player. player cannot push walls, but walls must push player. In other words, if walls move, they push. if player moves against wall, player gets stopped. 
*/
export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.actualResolve({pushableEntity})
  } 
  static actualResolve({pushableEntity, lastCall=false}:
  {pushableEntity: Base_Entity, lastCall?: boolean}) {
  if(pushableEntity.intangibility) {
    return;
  }
  
  const closestCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"));
  if(!(closestCollision)) {
    return;
  } 
  
  
  const otherEntity = closestCollision.entityB;
  const Pushable_Position_Just_Before_Collision = closestCollision.Position_Just_Before_Collision_A; 
  const xDistBetweenStartingPointAndCollisionPoint = Pushable_Position_Just_Before_Collision.x - pushableEntity.x;
  /* example: if player moves left up, colides with an above wall, player's vy is stopped. so now, player moves left only.
    between starting point and collision point, player has spent some x velocity as well. so, we should also decrease player's x velocity by an amount. Otherwise, if player is moving very fast, it will basically move its full speed plus distance between starting x and collision.x. this actually should not create any issues except player moving faster than expected, but I like the logical consistency more.
  
  */
  const yDistBetweenStartingPointAndCollisionPoint = Pushable_Position_Just_Before_Collision.y - pushableEntity.y;
  console.log(xDistBetweenStartingPointAndCollisionPoint,yDistBetweenStartingPointAndCollisionPoint)
  const currentVX = pushableEntity.velocity.x.get()
  const currentVY = pushableEntity.velocity.y.get()
  const spentVX = xDistBetweenStartingPointAndCollisionPoint / Game_Loop.deltaTime;
  const spentVY = yDistBetweenStartingPointAndCollisionPoint / Game_Loop.deltaTime;
  /* / here, I can add both to respective velocities because below I will either nullify or keep it as is. in other words, I can just do this right now in batch */
  pushableEntity.velocity.x.Add_Component({
    key:`Negate_Spent_Velocity`,
    value: spentVX
  })
  pushableEntity.velocity.y.Add_Component({
    key:`Negate_Spent_Velocity`,
    value: spentVY
  })

   const playerFace = closestCollision.aFacingB;
   const otherEntityFace = closestCollision.bFacingA;
   const newPlayerPos = {
     x:0,
     y:0
   }
   
   const offset = 0;
   const offsetX = Math.sign(pushableEntity.velocity.x.get()) * 0;
   const offsetY = Math.sign(pushableEntity.velocity.y.get()) * 0;
   const playerBeforeCollY= offsetY + Pushable_Position_Just_Before_Collision.y 
   const playerBeforeCollX= offsetX + Pushable_Position_Just_Before_Collision.x; 
   switch(otherEntityFace) {
     case "right":
        newPlayerPos.x = otherEntity.x + otherEntity.width + offset;
        newPlayerPos.y = playerBeforeCollY;
      break;
      
      case "left":
        newPlayerPos.x = otherEntity.x - offset - pushableEntity.width;
        newPlayerPos.y = playerBeforeCollY;
      break;
      
      case "up":
        newPlayerPos.x = playerBeforeCollX
        newPlayerPos.y = otherEntity.y - offset - pushableEntity.height;
      break;
      
      case "down":
        newPlayerPos.x = playerBeforeCollX
        newPlayerPos.y = otherEntity.y + otherEntity.height + offset;
        
      break;
      default:
       throw new Error("Must neve happen")
      break;
      
   } 
   pushableEntity.setPosition(newPlayerPos);
  switch(playerFace) {
    case "up":
      case "down":
   pushableEntity.velocity.y.nullify();
   otherEntity.velocity.y.Add_To(pushableEntity.velocity.y);
   break;
       case "left":
      case "right":
    pushableEntity.velocity.x.nullify();
    otherEntity.velocity.x.Add_To(pushableEntity.velocity.x);
      break;
  }
   

    if(lastCall) {
      return;
    }

   this.actualResolve({pushableEntity, lastCall: true});
  }
}