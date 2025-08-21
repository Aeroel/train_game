import { My_Assert } from "#root/My_Assert.js";
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
  const subDivisions = 500;
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
    let imin = i;
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
      // Calculate centers
  const centerA = {
    x: a.x + a.width / 2,
    y: a.y + a.height / 2,
  };
  const centerB = {
    x: b.x + b.width / 2,
    y: b.y + b.height / 2,
  };

  // Calculate deltas
  const deltaX = centerB.x - centerA.x;
  const deltaY = centerB.y - centerA.y;

  // Determine primary facing direction based on the larger delta
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal facing
    if (deltaX > 0) {
      // b is to the right of a
      return { aFace: "right", bFace: "left" };
    } else {
      // b is to the left of a
      return { aFace: "left", bFace: "right" };
    }
  } else {
    // Vertical facing
    if (deltaY > 0) {
      // b is below a
      return { aFace: "down", bFace: "up" };
    } else {
      // b is above a
      return { aFace: "up", bFace: "down" };
    }
  }

    }
}

