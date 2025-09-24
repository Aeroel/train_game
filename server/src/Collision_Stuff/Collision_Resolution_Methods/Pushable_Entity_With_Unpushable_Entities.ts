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
    if (pushableEntity.intangibility) {
      return;
    }
         const firstCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
      if (!firstCollision) {
        return;
      }
      
    const dt = World_Tick.deltaTime;
    const pe = pushableEntity;

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


 const uneOldPos = {
    x: une.x,
    y: une.y,
  }
  const uneTransX = une.x + (une.vx * ct * dt);
  const uneTransY = une.y + (une.vy * ct * dt);
  
  const newPe = {
    x: pe.x + ((pe.vx * dt * ct)),
    y: pe.y + ((pe.vy * dt * ct)),
    vx: pe.vx,
    vy: pe.vy,
  }
  const offset = 2;
  if(cn.x === 1) {
    newPe.x = uneTransX + une.width + offset;
    newPe.vx=0;
    if(une.vx > 0) {
      newPe.vx = une.vx * rt;
    }
  }
  if(cn.x === -1) {
    newPe.x = uneTransX - pe.width - offset;
       newPe.vx=0;
      if(une.vx < 0) {
         newPe.vx = une.vx * rt;
    }
  }
  
  if(cn.y === 1) {
    newPe.y = uneTransY + une.height + offset;
        newPe.vy=0;
            if(une.vy > 0) {
      newPe.vy = une.vy * rt;
    }
  }
  if(cn.y === -1) {
    newPe.y = uneTransY - pe.height - offset;
        newPe.vy=0;
                    if(une.vy < 0) {
      newPe.vy = une.vy * rt;
    }
  }
  pe.x = newPe.x;
  pe.y = newPe.y;
if(cn.y===0) {
   pe.x = Math.trunc(newPe.x); 
}else {
    pe.y = Math.trunc(newPe.y);
}
 const ceilLvl = 3;
  pe.vx = ceilERN(newPe.vx, ceilLvl);
  pe.vy = ceilERN(newPe.vy, ceilLvl);

// FIRST resolution END 



      const overlapAfterFirstResolution = (Collision_Stuff.static_No_Velocity_Collision_Check(pe, une))
        My_Assert.that(!overlapAfterFirstResolution, `overlapAfterFirstResolution: I expect xy of entities to not overlap after first resolution handle logic. Debug info: ${JSON.stringify({
        peBox: Collision_Stuff.entityToBoxWithVelocity(pe), uneBox: Collision_Stuff.entityToBoxWithVelocity(une)})}`)

      const overlapAtEndAfterFirstResolution = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtEndAfterFirstResolution, "overlapAtEndAfterFirstResolution: I expect entities not to overlap at first collision after resolution ending positions");

    const secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
      if (!secondCollision) {
        return;
      }
     let une2=  secondCollision.entityB;
    let ct2 =secondCollision.time
    let rt2 = 1 - ct;
    let cn2 =secondCollision.normal

      My_Assert.that(secondCollision.entityB !== firstCollision.entityB, "Got same wall second time, meaning first time resolution was incorrect")


      const overlapAfterSecondResolution = (Collision_Stuff.static_No_Velocity_Collision_Check(pe, une))
        My_Assert.that(!overlapAfterSecondResolution, `I expect xy of entities to not overlap after second resolution handle logic. Debug info: ${JSON.stringify({
        peBox: Collision_Stuff.entityToBoxWithVelocity(pe), uneBox: Collision_Stuff.entityToBoxWithVelocity(une)})}`)

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

