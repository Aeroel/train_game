import { Assert } from "#root/Assert.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info,  } from "#root/Type_Stuff.js";


import {World} from "#root/World.js"
import {Game_Loop} from "#root/Game_Loop.js"

export { Sub_Positions, };
class Sub_Positions {

static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {

  const dt = Game_Loop.deltaTime;
  const ADX = a.vx * dt; 
  const ADY = a.vy * dt; 
  const BDX = b.vx * dt; 
  const BDY = b.vy * dt; 
  const AEnd={x:a.x+ADX, y:a.y+ADY}
  const BEnd={x:b.x+BDX, y:b.y+BDY}
  const subDivisions = 10000;
  const ADXPerSubstep  = ADX / subDivisions;
  const ADYPerSubstep   = ADY / subDivisions;
  const BDXPerSubstep  = BDX / subDivisions;
  const BDYPerSubstep  = BDY / subDivisions;
 
 let collided= false;
 let ALastPosBeforeColl={
   x:a.x,
   y:a.y
 }
 let BLastPosBeforeColl={
   x:b.x,
   y:b.y
 }
  for(let i=0;i < subDivisions;i++) {
    const subAX = a.x + (i * ADXPerSubstep)
    const subAY = a.y + (i * ADYPerSubstep)
    const subBX = b.x + (i * BDXPerSubstep)
    const subBY = b.y + (i * BDYPerSubstep)
  /*  console.log(`Hi!
    ${subAX}
    ${subAY}
    ${subBX}
    ${subBX}
    
    `)*/
    const subABox = {
      x: subAX,
      y: subAY,
      width: a.width,
      height: a.height
    }
    const subBBox = {
      x: subBX,
      y: subBY,
      width: b.width,
      height: b.height
    }
     collided = this.boxesCollide(subBBox, subABox)
    if(collided) {
      break;
    }
    let imin = (i-5);
    if(i<=0) {
      imin=0;
    }
    ALastPosBeforeColl.x = a.x + (imin * ADXPerSubstep)
    ALastPosBeforeColl.y = a.y + (imin * ADYPerSubstep)
    BLastPosBeforeColl.x = b.x + (imin * BDXPerSubstep)
    BLastPosBeforeColl.y = b.y + (imin * BDYPerSubstep)
    
  }
  return this.genCollInfo(a,b, ALastPosBeforeColl, BLastPosBeforeColl, AEnd, BEnd, collided);
}

static genCollInfo(a:Base_Entity,b:Base_Entity, aLast: Position, bLast: Position, aEnd: Position, bEnd: Position, collisionHappened: boolean) {
  if(!collisionHappened) {
    return null;
  }
  const aLastBox = {...aLast, width:a.width,height:a.height}
  const bLastBox = {...bLast, width:b.width,height:b.height}
  const {aFace, bFace}=this.With_Which_Sides_Do_Two_Entities_Face_Each_Other(aLastBox, bLastBox);
  return {
  Starting_Position_A: {
    x:a.x,y:a.y
  } ,
  Starting_Position_B: {
    x:b.x,y:b.y
  } ,
  Theoretical_Ending_Position_A: {
    x:aEnd.x,y:aEnd.y
  } ,
  Theoretical_Ending_Position_B: {
    x:bEnd.x, y:bEnd.y
  } ,
  entityA: a,
  entityB: b,
  Position_Just_Before_Collision_A:aLast ,
  Position_Just_Before_Collision_B: bLast,
  bFacingA: bFace,
  aFacingB:aFace,
  }
}

static boxesCollide(box1: Box, box2: Box): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}


  static With_Which_Sides_Do_Two_Entities_Face_Each_Other(a: Box, b: Box):
  {aFace: Direction, bFace: Direction} {
    if (!this.boxesCollide(a, b)) {
      // If no collision, fallback to original logic for non-overlapping:
      // Vertical check
      if (a.y + a.height <= b.y) return { aFace: "down", bFace: "up" };
      if (b.y + b.height <= a.y) return { aFace: "up", bFace: "down" };
      // Horizontal check
      if (a.x + a.width <= b.x) return { aFace: "right", bFace: "left" };
      if (b.x + b.width <= a.x) return { aFace: "left", bFace: "right" };
      
      // Ambiguous case
      throw new Error("Rectangles do not collide but are in ambiguous positions.");
    }

    // Calculate overlap on each side
    const overlapLeft = (a.x + a.width) - b.x;    // How far a extends into b from left side of b
    const overlapRight = (b.x + b.width) - a.x;   // How far a extends into b from right side of b
    const overlapTop = (a.y + a.height) - b.y;    // How far a extends into b from top side of b
    const overlapBottom = (b.y + b.height) - a.y; // How far a extends into b from bottom side of b

    // Find min positive overlaps in horizontal and vertical directions
    const horizontalPenetration = Math.min(overlapLeft, overlapRight);
    const verticalPenetration = Math.min(overlapTop, overlapBottom);

    // Determine which penetration depth is smaller - priority to smaller penetration axis
    if (verticalPenetration < horizontalPenetration) {
      // Vertical faces
      if (overlapTop < overlapBottom) {
        // a faces up, b faces down
        return { aFace: "up", bFace: "down" };
      } else {
        // a faces down, b faces up
        return { aFace: "down", bFace: "up" };
      }
    } else {
      // Horizontal faces
      if (overlapLeft < overlapRight) {
        // a faces left, b faces right
        return { aFace: "left", bFace: "right" };
      } else {
        // a faces right, b faces left
        return { aFace: "right", bFace: "left" };
      }
    }
  }
}

