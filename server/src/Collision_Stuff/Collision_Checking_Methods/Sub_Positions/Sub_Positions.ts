import type {Direction, Position, 
//Collision_Info,
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { World_Tick } from "#root/World_Tick.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sub_Positions };

// { begin
type Collision_Info =  {
  entityA: Base_Entity;
  entityB: Base_Entity;
  time: number;
  // theoretical ending positions if there was no collision
  Theoretical_Ending_Position_A: Position;
  Theoretical_Ending_Position_B: Position;
  // positions just before the collision (a small epsilon back)
  Position_Just_Before_Collision_A: Position;
  Position_Just_Before_Collision_B: Position;

  collideAtStart: boolean;
  // Whether the entities actually collide at the positions that are supposedly "just before collision" positions. this can happen if a player is walking on top of a car (collideAtStart true collideAtJustBefore true) entity or just entered car (collideAtStart false, collideAtJustBefore true) , for example. (Remember, this is a topdown rts style game, not a platformer game) While in some resolution methods like between wall and player (where player can never push wall, while the wall might be moving if it is a car wall, so it must push player, not just stop player) I will make sure the player does not collide with anything at end of every tick and assert that collideAtJustBefore is false (if not false, this means reoslution on previous ticks was invalidly handled or even that the collision detection algorithm's logic is faulty and returned invalid results while resolution's logic is fine, or even  both might be broken.)
  collideAtJustBefore: boolean;
}

class Sub_Positions {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    const res= this.implementationCode(a, b, dt);
   return res;
  }

 
  private static implementationCode(a: Base_Entity, b: Base_Entity, dt: number, ): Collision_Info | null {
   let result: Collision_Info=this.getInfo(a,b);
   const substeps=1000;
   const aNext = a.calculateNextPositionBasedOnVelocityAndDeltaTime()
   const bNext = b.calculateNextPositionBasedOnVelocityAndDeltaTime()
   result.Theoretical_Ending_Position_A=aNext
   result.Theoretical_Ending_Position_B=bNext
   result.collideAtStart=Collision_Stuff.boxesCollide({...a.position,...a.size},  {...b.position,...b.size})
   
   const adx= aNext.x - a.x
   const ady= aNext.y - a.y
   const bdx= bNext.x - b.x
   const bdy=  bNext.y - b.y
   const axstep= adx /substeps;
   const aystep= ady / substeps;
   const bxstep= bdx/substeps;
   const bystep= bdy/ substeps;
   let collided= false
   let beforeA = {...a.position}
   let beforeB={...b.position}
   for(let i=0;i<substeps;i++){
     let subA = {...a.position, ...a.size}
     subA = {x:a.x+(i*axstep),y:a.y+(i*aystep), ...a.size}
     let subB = {...b.position, ...b.size};
     subB = {x:b.x+(i*bxstep),y:b.y+(i*bystep),  ...b.size}
     collided = Collision_Stuff.boxesCollide(subA, subB);
     if(collided) {
       break;
     }
     beforeA={x:subA.x,y:subA.y}
     beforeB={x:subB.x,y:subB.y}
 //    console.log(Collision_Stuff.boxesCollide(subA, subB))
    if(a.hasTag("Player") && b.hasTag("Wall") && a.isMoving() || b.isMoving()) { //console.log(Collision_Stuff.calculateFaces(subA, subB, a.vx, a.vy, b.vx, b.vy))
   }
   }
   if(collided) {
     result.Position_Just_Before_Collision_A = beforeA
     result.Position_Just_Before_Collision_B= beforeB
     result.collideAtJustBefore = Collision_Stuff.boxesCollide({...beforeA, ...a.size}, {...beforeB, ...b.size});
         return result;
   }
 return null;
  }


static getInfo(a: Base_Entity, b: Base_Entity) {
  return {
  entityA: a,
  entityB: b,
  time: 0,
  Theoretical_Ending_Position_A: {x:0,y:0},
  Theoretical_Ending_Position_B: {x:0,y:0},

  Position_Just_Before_Collision_A: {x:0,y:0},
  Position_Just_Before_Collision_B: {x:0,y:0},

  collideAtStart: false,
  collideAtJustBefore: false,
  }
}
}

// } end

