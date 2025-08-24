import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Game_Loop} from "#root/Game_Loop.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"

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
  console.log("coll 1");
  console.log(closestCollision)
  My_Assert.that(closestCollision.collideAtStart === false, "Colliding at start, but I don't want to allow that");
  My_Assert.that(closestCollision.collideAtJustBefore === false, "Colliding at last before collision, but I do not allow for that in pushableVsUnpushable. if this assertion fails, then this means that either the collision info was invalid and/or the collision was resolved (i.e., pushable) incorrectly in some previous tick");
  console.log(`coll resolution 1`)
  
  const otherEntity = closestCollision.entityB;
 
  const Pushable_Position_Just_Before_Collision = closestCollision.Position_Just_Before_Collision_A; 
  const otherJustBefore = closestCollision.Position_Just_Before_Collision_B; 

  const xDistBetweenStartingPointAndCollisionPoint = Pushable_Position_Just_Before_Collision.x - pushableEntity.x;
  /* example: if player moves left up, colides with an above wall, player's vy is stopped. so now, player moves left only.
    between starting point and collision point, player has spent some x velocity as well. so, we should also decrease player's x velocity by an amount. Otherwise, if player is moving very fast, it will basically move its full speed plus distance between starting x and collision.x. this actually should not create any issues except player moving faster than expected, but I like the logical consistency more.
  
  */
  const yDistBetweenStartingPointAndCollisionPoint = Pushable_Position_Just_Before_Collision.y - pushableEntity.y;

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

const aTemp = {x: Pushable_Position_Just_Before_Collision.x, y: Pushable_Position_Just_Before_Collision.y, width: pushableEntity.width, height: pushableEntity.height};
const bTemp = {x: otherJustBefore.x, y: otherJustBefore.y, width: otherEntity.width, height: otherEntity.height};

  const faces = Collision_Stuff.calculateFaces(aTemp, bTemp, pushableEntity.vx, pushableEntity.vy, otherEntity.vx, otherEntity.vy);

   const playerFace = faces.aFacingB;
   const otherEntityFace = faces.bFacingA;
   const newPlayerPos = {
     x:0,
     y:0
   }
   
   const offset = 0.0000;
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
       throw new Error("Must never happen")
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
      console.log(`Coll resolution 2`)
      return;
    }

   this.actualResolve({pushableEntity, lastCall: true});
  }


}
