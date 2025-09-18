

export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.resolveCode({pushableEntity})
  }
  
  
  static resolveCode({pushableEntity}:
  {pushableEntity: Base_Entity
  }) {
  if(pushableEntity.intangibility) {
    return;
  }

const maxIterationsAllowed=3;
let itersCount=0;
const handledEntities: Base_Entity[]=[];
while(true) {
  My_Assert.that(itersCount < maxIterationsAllowed,`Resolution attempts exceeded allocated iterations of ${maxIterationsAllowed}`)
   const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
  (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"))
   );
  if(!collision) {
  break;
} 
// pushableEntity and unpushableEntity
const pe = pushableEntity
 const une = collision.entityB


const initialOverlap = Collision_Stuff.static_No_Velocity_Collision_Check(pe, une);
const alreadyHandled = handledEntities.includes(une);

const exp1 = Add_Expectation(!alreadyHandled, `I expect that if an unpushableEntity (debug: tags:${JSON.stringify(une.tags)}) already triggered resolution once this tick then it will not again collide with pushableEntity this tick. If it does collide again and again, this means the first resolution failed. The question to answer then is why did it fail the first time and how to avoid this issue?   `)
const exp2 = Add_Expectation(!initialOverlap,`I expect that the entities do not begin in overlap. Debug: ${
  JSON.stringify({
  une:Collision_Stuff.entityToBoxWithVelocity(une),
  pe:Collision_Stuff.entityToBoxWithVelocity(pe),
  uneTags:une.tags,
  peTaga: pe.tags,
    
  })
  
}`)
Verify_Expectations(exp1, exp2);

   this.resolveCollision(collision);
 
 
   const overlapAfterResolution = (Collision_Stuff.static_No_Velocity_Collision_Check(pe, une))
  const exp3 = Add_Expectation(!overlapAfterResolution, `I expect xy of entities to not overlap after resolution handle logic. Debug info: ${JSON.stringify({peBox: Collision_Stuff.entityToBoxWithVelocity(pe), uneBox: Collision_Stuff.entityToBoxWithVelocity(une)})}`)
  
  const overlapAtEnd = doOverlapAtEnd(pe, une)
  const exp4 = Add_Expectation(!overlapAtEnd, "I expect entities not to overlap at ending positions");
  Verify_Expectations(exp3, exp4);
   
   handledEntities.push(une)
     itersCount++
}
  }

static resolveCollision(collision: Collision_Info) {
  const unpushableEntity = collision.entityB;
  const pushableEntity = collision.entityA;
  const collisionTime = collision.time
  const collisionNormal = collision.normal
  const dt = World_Tick.deltaTime;
  this.handle({
    unpushableEntity,
    pushableEntity,
    dt,
    collisionTime,
    collisionNormal,
  })
}
static handle({collisionTime, collisionNormal, pushableEntity, unpushableEntity, dt}: {collisionTime: number, collisionNormal: Normal, pushableEntity: Base_Entity, unpushableEntity: Base_Entity, dt: number}) {

const CT = collisionTime;
const tAt = CT
const remT = 1 - tAt;
  const  dtAtAtCollision = dt * tAt;

 
  const pe = pushableEntity;
  const une = unpushableEntity;
  pe.x += pe.vx * dtAtAtCollision;
  pe.y += pe.vy * dtAtAtCollision;
  
    const arbitraryOffset = 5; //<-- without this offset, and without it being at least 5, an issue occurs: if a wall is too thin, then, even despite the collision getting correctly detected, the player passess through.
  pe.x += collisionNormal.x * arbitraryOffset
  pe.y += collisionNormal.y * arbitraryOffset;
 
  if(collisionNormal.x !==0){
    pe.vx=0;
    if(Math.sign(une.vx) === collisionNormal.x) {
      pe.vx = une.vx * remT;
    }
  } else {
    pe.vx = pe.vx * remT;
  }
  if (collisionNormal.y !==0){ 
    pe.vy=0;
        if(Math.sign(une.vy) === collisionNormal.y) {
      pe.vy = une.vy * remT;
    }
  } else {
    pe.vy = pe.vy * remT;
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

function roundTo(num: number, step: number): number {
  return Math.round(num / step) * step;
}





function mySwept(a: Box_With_Velocity, b: Box_With_Velocity, deltaTime: number): Swept_Result {
  
  let result: Swept_Result = {time:0, normal: {
      x: 0, y:0 
    }};
  if(overlap(a,b)) {
    result = {time:0, normal: {
      x: 0, y:0 
    }}
    return result;
  }
  const relx = a.vx - b.vx;
  const rely = a.vy - b.vy;
  // collision impossible if no initial overlap and no relative velocity
  if(relx ===0 && rely ===0){
    result=null
    return result
  }
  const expA = expandByVel(a, relx, rely, deltaTime)
  // also impossible if expanded A does not overlap b
  if(!overlap(expA, b)) { 
    result = null
    return result
  }
  
    let xTime0: number =0;
    let xTime100: number=0;
    let xOverlapStartPercent = -Infinity
    let xOverlapEndPercent = Infinity
    let xOverlapStartPoint: number = 0;
    let xOverlapEndPoint: number =0;
        if(relx <0) {
      xTime0 = expA.x + expA.width;
      xTime100 = expA.x;
      xOverlapStartPoint = b.x + b.width+ a.width;
      xOverlapEndPoint = b.x - a.width;

    }
    if(relx >0) {
      xTime0 = expA.x;
      xTime100 = expA.x + expA.width;
      xOverlapStartPoint = b.x - a.width;
      xOverlapEndPoint = b.x + b.width + a.width ;
    }
    if(relx !== 0) {
          xOverlapStartPercent = percentOf(xOverlapStartPoint, xTime0, xTime100)
      xOverlapEndPercent = percentOf(xOverlapEndPoint, xTime0, xTime100)
   
    }
    
    let yTime0: number=0;
    let yTime100: number=0;
    let yOverlapStartPercent = -Infinity;
    let yOverlapEndPercent = Infinity;
    let yOverlapStartPoint: number=0;
    let yOverlapEndPoint: number=0;
    if(rely >0) {
      yTime0 = expA.y;
      yTime100 = expA.y + expA.height
      yOverlapStartPoint = b.y - a.height;
      yOverlapEndPoint = b.y + b.height +  a.height;
    }
        if(rely < 0) {
      yTime0 = expA.y + expA.height;
      yTime100 = expA.y
      yOverlapStartPoint = b.y + b.height + a.height;
      yOverlapEndPoint = b.y - a.height;
    }
    if(rely !== 0) {
       yOverlapStartPercent = percentOf(yOverlapStartPoint, yTime0, yTime100)
      yOverlapEndPercent = percentOf(yOverlapEndPoint, yTime0, yTime100)
    }
    
    const overlapStartPercent = Math.max(xOverlapStartPercent, yOverlapStartPercent)
    const overlapEndPercent = Math.min(xOverlapEndPercent, yOverlapEndPercent);

    if(overlapStartPercent > overlapEndPercent ) {
      return null;
    }
    const overlapStartNormalizedTime = overlapStartPercent / 100;
    const normal = preferXIfDiagonal(calculateNormal(xOverlapStartPercent, yOverlapStartPercent, relx, rely));
    return {time: overlapStartNormalizedTime, normal};
  
}
function percentOf(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}
function overlap(a: Box,b: Box){
  
  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}
function expandByVel(entity: Box, vx: number, vy: number, deltaTime: number) : Box {
  const ex = { 
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
  };

  if (vx > 0) {
    ex.width += vx * deltaTime;
  } else {
    ex.x += vx * deltaTime;
    ex.width += -vx * deltaTime;
  }

  if (vy > 0) {
    ex.height += vy * deltaTime;
  } else {
    ex.y += vy * deltaTime;
    ex.height += -vy * deltaTime;
  }

  return ex;
}
function calculateNormal(xOverlapStartPercent: number, yOverlapStartPercent: number, relx: number, rely: number) {
  const normal: Normal = { x: 0, y: 0 };

  if (xOverlapStartPercent > yOverlapStartPercent) {
    // collision happened along X axis
    if (relx > 0) {
      normal.x = -1; // moving right, hit left side of b
    } else {
      normal.x = 1; // moving left, hit right side of b
    }
  } else {
    // collision happened along Y axis
    if (rely > 0) {
      normal.y = -1; // moving down, hit top of b
    } else {
      normal.y = 1; // moving up, hit bottom of b
    }
  }

  return normal;
}

function preferXIfDiagonal(normal: Normal) {
  
  if(normal.x !== 0 && normal.y !==0) {
   console.log("diagonal normal")
    return {
      ...normal,
      y: 0,
    }
  } 
  return normal;
}