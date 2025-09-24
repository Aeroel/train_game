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
  I_Expect_That,
  Verify_Expectations,
  Add_Expectation
} from "#root/I_Expect_That.js"
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
      // pushableEntity and unpushableEntity
      const pe = pushableEntity
      const une = firstCollision.entityB


      const initialOverlap = Collision_Stuff.static_No_Velocity_Collision_Check(pe, une);

        My_Assert.that(!initialOverlap, `I expect that the entities do not begin in overlap. Debug: ${
        JSON.stringify({
          une: Collision_Stuff.entityToBoxWithVelocity(une),
          pe: Collision_Stuff.entityToBoxWithVelocity(pe),
          uneTags: une.tags,
          peTags: pe.tags,

        })

        }`)

      this.resolveFirstCollision(firstCollision);


      const overlapAfterFirstResolution = (Collision_Stuff.static_No_Velocity_Collision_Check(pe, une))
        My_Assert.that(!overlapAfterFirstResolution, `I expect xy of entities to not overlap after first resolution handle logic. Debug info: ${JSON.stringify({
        peBox: Collision_Stuff.entityToBoxWithVelocity(pe), uneBox: Collision_Stuff.entityToBoxWithVelocity(une)})}`)

      const overlapAtFirstEnd = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtFirstEnd, "I expect entities not to overlap at first collision after resolution ending positions");

    const secondCollision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
        (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
      );
      if (!secondCollision) {
        return;
      }
      My_Assert.that(secondCollision.entityB !== firstCollision.entityB, "Got same wall second time, meaning first time resolution was incorrect")
     this.resolveSecondCollision(secondCollision);

      const overlapAfterSecondResolution = (Collision_Stuff.static_No_Velocity_Collision_Check(pe, une))
        My_Assert.that(!overlapAfterSecondResolution, `I expect xy of entities to not overlap after second resolution handle logic. Debug info: ${JSON.stringify({
        peBox: Collision_Stuff.entityToBoxWithVelocity(pe), uneBox: Collision_Stuff.entityToBoxWithVelocity(une)})}`)

      const overlapAtSecondEnd = doOverlapAtEnd(pe, une)
     My_Assert.that(!overlapAtSecondEnd, "I expect entities not to overlap at second collision after resolution ending positions");



    
  }

  static resolveFirstCollision(collision: Collision_Info) {
    const une=  collision.entityB;
    const pe = collision.entityA;
    const ct = collision.time
    const rt = 1 - ct;
    const cn = collision.normal
    const dt = World_Tick.deltaTime;

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
  const offset = 1;
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


  pe.x = newPe.x
  pe.y = newPe.y
  pe.vx = newPe.vx;
  pe.vy = newPe.vy;

  
  
  }
  
  static resolveSecondCollision(collision: Collision_Info) {
    const une=  collision.entityB;
    const pe = collision.entityA;
    const ct = collision.time
    const rt = 1 - ct;
    const cn = collision.normal
    const dt = World_Tick.deltaTime;

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
  const offset = 1;
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


  pe.x = newPe.x
  pe.y = newPe.y
  pe.vx = newPe.vx;
  pe.vy = newPe.vy;

  
  
  }




}

function doOverlapAtEnd(pe: Base_Entity, une: Base_Entity): boolean {
  const peEndBox = Collision_Stuff.posToBox(pe, pe.getEndPos());
  const uneEndBox = Collision_Stuff.posToBox(une, une.getEndPos());

  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(peEndBox, uneEndBox
  );
  return collideAtEndPositions
}

function roundTo(num: number, step: number): number {
  return Math.round(num / step) * step;
}