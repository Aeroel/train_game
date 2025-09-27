import {
  Collision_Stuff
} from "#root/Collision_Stuff/Collision_Stuff.js";

import {
  World_Tick
} from "#root/World_Tick.js"
import type {
  Normal,
  Collision_Info
} from "#root/Type_Stuff.js"
import {
  Base_Entity
} from "#root/Entities/Base_Entity.js";
import {
  My_Assert
} from "#root/My_Assert.js"
import {
  ceilERN
} from "#root/Utilities/Numerical.js"
import {
  log
} from "#root/My_Log.js"
import {
  Helper_Functions
} from "#root/Helper_Functions.js"

/*
Basically, this is for player. player cannot push walls, but walls must push player. In other words, if walls move, they push. if player moves against wall, player gets stopped.
*/
export class Pushable_Entity_With_Unpushable_Entities {
  static handledEntities: Base_Entity[]=[];
  static resolve( {
    pushableEntity
  }: {
    pushableEntity: Base_Entity
  }) {
    this.resolveCode( {
      pushableEntity
    })
  }

/* the logic here relies on:
1. only one axis being prefered as normal in case actual collision is perfect diagonal. if I modify collision detevtion to return true diagonal normal in rare cases when it occurs, I would need to rework the resolution logic. I do not need to have perfect diagonal normals, I think, but even if I find later I want them, I do not expect rewriting to be specially complicated.

*/
  static resolveCode( {
    pushableEntity
  }:
    {
      pushableEntity: Base_Entity
    }) {
    if (pushableEntity.intangibility) {
      return;
    }
    const alreadyAccountedFor: Base_Entity[]=[];
         const firstCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
      if (!firstCollision) {
        return;
      }
          const closestCollisions1 = Collision_Stuff.getRepresentativeCollisions(
      pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
          const pe = pushableEntity;
          const dt = World_Tick.deltaTime;
        const offset = 2;

      if(closestCollisions1.collisions.length ===2){
        
        const rt = 1 - closestCollisions1.collisions[0].time;
        // closest unpushables
        const clcoll1 = closestCollisions1.collisions[0];
        const clcoll2 = closestCollisions1.collisions[1];
   
        const clune1 = clcoll1.entityB;
        const clune1TransX = clune1.x + (clune1.vx * dt * clcoll1.time)
        const clune1TransY = clune1.y + (clune1.vy * dt * clcoll1.time)
   
        const clune2 = clcoll2.entityB;
        const clune2TransX = clune2.x + (clune2.vx * dt * clcoll2.time)
        const clune2TransY = clune2.y + (clune2.vy * dt * clcoll2.time)
        alreadyAccountedFor.push(clune1)
        alreadyAccountedFor.push(clune2)
        if(clcoll1.normal.x !== 0) {
         if(clcoll1.normal.x >0) { 
          pe.x = clune1TransX + clune1.width + offset;
         } 
         
         if(clcoll1.normal.x < 0) { 
          pe.x = clune1TransX - pe.width - offset;
         } 
         
         pe.vx = 0;
          if(clcoll1.normal.x === Math.sign(clune1.vx)) {
            pe.vx = clune1.vx * rt;
          }
        }
        if(clcoll1.normal.y !== 0) {
         if(clcoll1.normal.y >0) {
            pe.y = clune1TransY + clune1.height + offset;
        }
         if(clcoll1.normal.y < 0) {
            pe.y = clune1TransY - pe.height - offset;
        }
        pe.vy=0;
          if(clcoll1.normal.y === Math.sign(clune1.vy)) {
            pe.vy = clune1.vy * rt;
          }
        }
        
        // clcoll2
    
              if(clcoll2.normal.x !== 0) {
         if(clcoll2.normal.x >0) { 
          pe.x = clune2TransX + clune2.width + offset;
         } 
         if(clcoll2.normal.x < 0) { 
          pe.x = clune2TransX - pe.width - offset;
         } 
         
           pe.vx=0;
          if(clcoll2.normal.x === Math.sign(clune2.vx)) {
            pe.vx = clune2.vx * rt;
          }
        }
        if(clcoll2.normal.y !== 0) {
         if(clcoll2.normal.y >0) {
            pe.y = clune2TransY + clune2.height + offset;
        }
         if(clcoll2.normal.y < 0) {
            pe.y = clune2TransY - pe.height - offset;
        }
        pe.vy=0;
          if(clcoll2.normal.y === Math.sign(clune2.vy)) {
            pe.vy = clune2.vy * rt;
          }
        }
        
        // end clcoll2 
        console.log("222222")
        return;
      }



    let une=  firstCollision.entityB;
    let ct =firstCollision.time
    let rt = 1 - ct;
    let cn =firstCollision.normal

  const initialOverlapAtFirst = Collision_Stuff.static_No_Velocity_Collision_Check(pe, une);

        My_Assert.that(!initialOverlapAtFirst, `initialOverlapAtFirst: I expect that the entities do not begin in overlap. Debug: ${
        JSON.stringify({
          une: Collision_Stuff.entityToBoxWithVelocity(une),
          pe: Collision_Stuff.entityToBoxWithVelocity(pe),
          uneTags: une.tags,
          peTags: pe.tags,

        })

        }`)

// FIRST resolution BEGIN

  
  const newPe = {
    x: pe.x,
    y: pe.y,
    vx: pe.vx,
    vy: pe.vy,
  }

  if(cn.x === 1) {
    newPe.x = une.x + une.width + offset;
    newPe.vx=0;
    newPe.vy *= rt;
    if(une.vx > 0) {
      newPe.vx = une.vx;
    }
    
  }
  if(cn.x === -1) {
    newPe.x = une.x - pe.width - offset;
       newPe.vx=0;
        newPe.vy *= rt;
      if(une.vx < 0) {
         newPe.vx = une.vx;
    }
  }
  
  if(cn.y === 1) {
    newPe.y = une.y + une.height + offset;
        newPe.vy=0;
            newPe.vx *= rt;
            if(une.vy > 0) {
      newPe.vy = une.vy;
    }
  }
  if(cn.y === -1) {
    newPe.y = une.y - pe.height - offset;
        newPe.vy=0;
            newPe.vx *= rt;
          if(une.vy < 0) {
      newPe.vy = une.vy;
    }
  }
  pe.x = newPe.x;
  pe.y = newPe.y;
 pe.vx = newPe.vx
 pe.vy = newPe.vy


// FIRST resolution END 


      const overlapAtEndAfterFirstResolution = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtEndAfterFirstResolution, "overlapAtEndAfterFirstResolution: I expect entities not to overlap at first collision after resolution ending positions");

   alreadyAccountedFor.push(une);
      
    const secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (
          !(alreadyAccountedFor.includes(unpushableEntity)) 
            && (unpushableEntity.hasTag("Wall") 
            || unpushableEntity.hasTag("Sliding_Door")))
      );
      if (!secondCollision) {
        return;
      }
      
     let une2=  secondCollision.entityB;

    let ct2 =secondCollision.time
    let rt2 = 1 - ct2;
    let cn2 =secondCollision.normal

   // SECOND RESOLUTION BEGIN
   
   if(cn.x !==0) {
     const ySign = Math.sign(pe.vy);
     const yNormal = ySign * -1;
     if(yNormal > 0) {
       pe.y = une2.y + une2.height + offset;
       pe.vy =0
       if(une2.vy > 0) {
         pe.vy = une2.vy;
       }
     } else if (yNormal < 0){
        pe.y = une2.y- pe.height - offset;
        pe.vy=0;
        if(une2.vy < 0) {
         pe.vy = une2.vy
       }
     }
   } else if (cn.y !== 0) {
      const xSign = Math.sign(pe.vx);
     const xNormal = xSign * -1;
     if(xNormal >0) {
       pe.x = une2.x+ une2.width + offset;
       pe.vx = 0;
       if(une2.vx > 0) {
         pe.vx = une2.vx;
       }
     } else if(xNormal < 0) {
      pe.x = une2.x - pe.width - offset;
       pe.vx = 0;
       if(une2.vx < 0) {
         pe.vx = une2.vx;
       }
     }

   }
   

   // SECOND RESOLUTION END

      const overlapAtEndAfterSecondResolution = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtEndAfterSecondResolution, "overlapAtEndAfterSecondResolution: I expect entities not to overlap at second collision after resolution ending positions");



    
  }



}

function doOverlapAtEnd(pe: Base_Entity, une: Base_Entity): boolean {
  const peEndBox = Collision_Stuff.posToBox(pe, pe.getEndPos());
  const uneEndBox = Collision_Stuff.posToBox(une, une.getEndPos());

  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(peEndBox, uneEndBox
  );
  return collideAtEndPositions
}

