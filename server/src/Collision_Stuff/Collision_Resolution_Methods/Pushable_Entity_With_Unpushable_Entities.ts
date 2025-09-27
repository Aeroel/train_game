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



       this.cluneResolve(clcoll1, pe, dt, offset);
        
        // clcoll2
    
    
    
        this.cluneResolve(clcoll2, pe, dt, offset);
                // end clcoll2 
        console.log("222222")
        My_Assert.that(!(Collision_Stuff.static_No_Velocity_Collision_Check(pe.endBox(), clcoll1.entityB)))
        My_Assert.that(!(Collision_Stuff.static_No_Velocity_Collision_Check(pe.endBox(), clcoll2.entityB)))

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
    x: pe.x + (pe.vx * dt * ct),
    y: pe.y + (pe.vy * dt * ct),
    vx: pe.vx,
    vy: pe.vy,
  }
  
const uneEnd = {
  x: une.x + (une.vx * dt),
  y: une.y + (une.vy * dt),
}

  if(cn.x === 1) {
    newPe.x = uneEnd.x + une.width + offset;
    newPe.vy *= rt;
    newPe.vx=0;
    
  }
 else if(cn.x === -1) {
    newPe.x = uneEnd.x - pe.width - offset;
    newPe.vx=0;
    newPe.vy *= rt;
  }
  
 else if(cn.y === 1) {
    newPe.y = uneEnd.y + une.height + offset;
    newPe.vy=0;
    newPe.vx *= rt;

  }
 else if(cn.y === -1) {
    newPe.y = uneEnd.y - pe.height - offset;
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
         console.log("time 0 enter")
        
         if(1>0)throw new Error(`
         ${JSON.stringify(secondCollision.normal)}`)
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
 
  console.log("second enter")


    let ct2 =secondCollision.time
  
    let cn2 =secondCollision.normal
   // SECOND RESOLUTION BEGIN
   const une2End = Collision_Stuff.posToBox(une2, une2.getEndPos());
   
   let xNormal = cn2.x
   let yNormal = cn2.y
   if(cn2.y !==0) {
     if(yNormal > 0) {
       pe.y = une2End.y + une2.height + offset;
       pe.vy =0

     } else if (yNormal < 0){
        pe.y = une2End.y - pe.height - offset;
        pe.vy=0;

     }
   } else if (cn2.x !== 0) {
     if(xNormal >0) {
       pe.x = une2End.x+ une2.width + offset;
       pe.vx = 0;

     } else if(xNormal < 0) {
      pe.x = une2End.x - pe.width - offset;
       pe.vx = 0;

     }

   }

   // SECOND RESOLUTION END



      const overlapAtEndAfterSecondResolution = doOverlapAtEnd(pe, une2)
     My_Assert.that(!overlapAtEndAfterSecondResolution, "overlapAtEndAfterSecondResolution: I expect entities not to overlap at second collision after resolution ending positions");

   pe.x += dx
   pe.y += dy

    
  }


static cluneResolve( clcoll: Collision_Info, pe: Base_Entity, dt: number, offset: number) {
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
         
 
          pe.vx = 0;
        } else if(clcoll.normal.y !== 0) {
         if(clcoll.normal.y >0) {
            pe.y = cluneEndY + clune.height + offset;
        }
         if(clcoll.normal.y < 0) {
            pe.y = cluneEndY - pe.height - offset;
        }



         pe.vy = 0


        }
}

}

function doOverlapAtEnd(pe: Base_Entity, une: Base_Entity): boolean {
  const peEndBox = Collision_Stuff.posToBox(pe, pe.getEndPos());
  const uneEndBox = Collision_Stuff.posToBox(une, une.getEndPos());

  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(peEndBox, uneEndBox
  );
  return collideAtEndPositions
}

