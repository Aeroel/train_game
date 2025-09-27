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
    const cornerPresent= this.resolveCornerCollisionIfPresent(pushableEntity, dt, offset);
    if(cornerPresent) {
      return; // <-- since it got resolved I do not expect any other collisions
    }

         const firstCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
      if (!firstCollision) {
        return;
      }



    let une=  firstCollision.entityB;
    let ct =firstCollision.time
    let rt = 1 - ct;
    let cn =firstCollision.normal

// FIRST resolution BEGIN


  const resolvedPe1 = {
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
    resolvedPe1.x = uneEnd.x + une.width + offset;
    resolvedPe1.vy *= rt;
    resolvedPe1.vx=0;
    
  }
 else if(cn.x === -1) {
    resolvedPe1.x = uneEnd.x - pe.width - offset;
    resolvedPe1.vx=0;
    resolvedPe1.vy *= rt;
  }
  
 else if(cn.y === 1) {
    resolvedPe1.y = uneEnd.y + une.height + offset;
    resolvedPe1.vy=0;
    resolvedPe1.vx *= rt;

  }
 else if(cn.y === -1) {
    resolvedPe1.y = uneEnd.y - pe.height - offset;
    resolvedPe1.vy=0;
    resolvedPe1.vx *= rt;
  }

 pe.vx = resolvedPe1.vx
 pe.vy = resolvedPe1.vy


// FIRST resolution END 

   
   /* do not apppy resolvedPe.xy to Pe yet
    
    */
    let secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity !== une &&  (unpushableEntity.hasTag("Wall") 
            || unpushableEntity.hasTag("Sliding_Door")))
      );
      if (!secondCollision) {
        return;
      }
       let une2=  secondCollision.entityB;

  console.log("second enter")


    let ct2 =secondCollision.time
  
    let cn2 =secondCollision.normal
   // SECOND RESOLUTION BEGIN
   const une2End = une2.getEndPos();
   
     if(cn2.y > 0) {
       pe.x = resolvedPe1.x;
       pe.y = une2End.y + une2.height + offset;
       pe.vy =0

     } else if (cn2.y < 0){
        pe.x = resolvedPe1.x;
        pe.y = une2End.y - pe.height - offset;
        pe.vy=0;

     }
     if(cn2.x >0) {
              pe.y = resolvedPe1.y;
       pe.x = une2End.x+ une2.width + offset;
       pe.vx = 0;

     } else if(cn2.x < 0) {
       pe.y = resolvedPe1.y;
      pe.x = une2End.x - pe.width - offset;
       pe.vx = 0;

     }

   

   // SECOND RESOLUTION END

// So, this is it?


    
  }
static resolveCornerCollisionIfPresent(pushableEntity: Base_Entity, dt: number, offset: number) {
  const pe = pushableEntity;
          console.log("corner resolving attempt")
    const closestCollisions1 = Collision_Stuff.getRepresentativeCollisions(
      pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );

      if(closestCollisions1.collisions.length <2){
        log("not a corner.")
        return false;
      }
      if(closestCollisions1.collisions.length ===2){
        // closest unpushables
        const clcoll1 = closestCollisions1.collisions[0];
        const clcoll2 = closestCollisions1.collisions[1];



       this.cluneResolve(clcoll1, pe, dt, offset);
        
        // clcoll2
    
    
    
        this.cluneResolve(clcoll2, pe, dt, offset);
                // end clcoll2 

        My_Assert.that(!(Collision_Stuff.static_No_Velocity_Collision_Check(pe.endBox(), clcoll1.entityB)))
        My_Assert.that(!(Collision_Stuff.static_No_Velocity_Collision_Check(pe.endBox(), clcoll2.entityB)))
        log("resolved a corner.")
        return true;
      }
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

