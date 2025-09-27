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
        const pe = pushableEntity;
        const dt = World_Tick.deltaTime;
        const offset = 2;
        
    if (pushableEntity.intangibility) {
      return;
    }

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


      if(closestCollisions1.collisions.length ===2){
        // closest unpushables
        const clcoll1 = closestCollisions1.collisions[0];
        const clcoll2 = closestCollisions1.collisions[1];



       this.clune(clcoll1, pe);
        
        // clcoll2
    
        this.clune(clcoll2, pe);
        
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
    x: pe.x + (pe.vx * dt * rt),
    y: pe.y + (pe.vy * dt * rt),
    vx: pe.vx,
    vy: pe.vy,
  }

  if(cn.x === 1) {
    newPe.x = une.x + une.width + offset;
    newPe.vy *= rt;
    newPe.vx=0;
    
  }
  if(cn.x === -1) {
    newPe.x = une.x - pe.width - offset;
    newPe.vx=0;
    newPe.vy *= rt;
  }
  
  if(cn.y === 1) {
    newPe.y = une.y + une.height + offset;
    newPe.vy=0;
    newPe.vx *= rt;

  }
  if(cn.y === -1) {
    newPe.y = une.y - pe.height - offset;
    newPe.vy=0;
    newPe.vx *= rt;
  }
  pe.x = newPe.x;
  pe.y = newPe.y;
 pe.vx = newPe.vx
 pe.vy = newPe.vy


// FIRST resolution END 


      const overlapAtEndAfterFirstResolution = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtEndAfterFirstResolution, "overlapAtEndAfterFirstResolution: I expect entities not to overlap at first collision after resolution ending positions");

   
   //    
    let secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        ( (unpushableEntity.hasTag("Wall") 
            || unpushableEntity.hasTag("Sliding_Door")))
      );
      if (!secondCollision) {
        return;
      }
       let une2=  secondCollision.entityB;
       let dx = 0;
       let dy = 0;
       if(secondCollision.time===0) {
          const prevX = pe.x;
          const prevY = pe.y;
        if(cn.y === 1){
          pe.y = une2.y - pe.height - offset;
        } else if (cn.y === -1) {
          pe.y = une.y + une.height + offset;
        } else if (cn.x ===1) {
                    pe.x = une2.x - pe.width - offset;
        } else if (cn.x===-1){
                    pe.x = une.x + une.width + offset;
        }
          dx = pe.x - prevX;
          dy = pe.y - prevY;
          
          const stillOverlappingWithThirdParty = Collision_Stuff.static_No_Velocity_Collision_Check(pe, une2)
        My_Assert.that(!stillOverlappingWithThirdParty, "Overlap with third party wall must be resolved")
  
       secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        ( (unpushableEntity.hasTag("Wall") 
            || unpushableEntity.hasTag("Sliding_Door")))
      );
      if (!secondCollision) {
        return;
      }
       une2=  secondCollision.entityB;
      }
 
 


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

     } else if (yNormal < 0){
        pe.y = une2.y - pe.height - offset;
        pe.vy=0;

     }
   } else if (cn.y !== 0) {
      const xSign = Math.sign(pe.vx);
     const xNormal = xSign * -1;
     if(xNormal >0) {
       pe.x = une2.x+ une2.width + offset;
       pe.vx = 0;

     } else if(xNormal < 0) {
      pe.x = une2.x - pe.width - offset;
       pe.vx = 0;

     }

   }
   

   // SECOND RESOLUTION END



      const overlapAtEndAfterSecondResolution = doOverlapAtEnd(pe, une2)
     My_Assert.that(!overlapAtEndAfterSecondResolution, "overlapAtEndAfterSecondResolution: I expect entities not to overlap at second collision after resolution ending positions");

   pe.x += dx
   pe.y += dy

    
  }



}

function doOverlapAtEnd(pe: Base_Entity, une: Base_Entity): boolean {
  const peEndBox = Collision_Stuff.posToBox(pe, pe.getEndPos());
  const uneEndBox = Collision_Stuff.posToBox(une, une.getEndPos());

  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(peEndBox, uneEndBox
  );
  return collideAtEndPositions
}


static clune( clcoll: Collision_Info, pe: Base_Entity) {
        const clune = clcoll.entityB;
        const cluneEndX = clune.x + (clune.vx * dt);
        const cluneEndY = clune.y + (clune.vy * dt);
          if(clcoll.normal.x !== 0) {
         if(clcoll.normal.x >0) { 
          pe.x = cluneEndX + clune.width + offset;
         } 
         
         if(clcoll.normal.x < 0) { 
          pe.x = cluneEndX - pe.width - offset;
         } 
         
         if((pe.vx < 0 && clune.vx > 0) ||
            (pe.vx > 0 && clune.vx < 0)
            ) {
         pe.vx = 0;
         } else if (
           (clune.vx > 0 && (pe.vx > 0 || pe.vx === 0) ||
           (clune.vx < 0 && (pe.vx < 0 || pe.vx === 0))
           ) {
             // the above else if can only trigger if 1. collision occurred and 2. this means that wall moved faster than player. so, I guess this is a correct way to handle this?
             pe.vx=0
         } 
         
        }
        if(clcoll.normal.y !== 0) {
         if(clcoll.normal.y >0) {
            pe.y = cluneEndY + clune.height + offset;
        }
         if(clcoll.normal.y < 0) {
            pe.y = cluneEndY - pe.height - offset;
        }

         if((pe.vy < 0 && clune.vy > 0) ||
            (pe.vy > 0 && clune.vy < 0)
            ) {
         pe.vy = 0;
         } else if (
           (clune.vy > 0 && (pe.vy > 0 || pe.vy === 0) ||
           (clune.vy < 0 && (pe.vy < 0 || pe.vy === 0))
           ) {
             // the above else if can only trigger if 1. collision occurred and 2. this means that wall moved faster than player. so, I guess this is a correct way to handle this?
             pe.vy=0
         } 


        }
}