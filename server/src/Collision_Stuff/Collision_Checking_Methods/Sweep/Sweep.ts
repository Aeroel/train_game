import type {Direction, Position, 
Collision_Time_And_Normal, Simplified_Enity, Collision_Info, Normal, 
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { World_Tick } from "#root/World_Tick.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };


class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    const primary = this.implementationCode(a, b);
    if(!primary) return null;
    const info = {...primary, entityA:a, entityB:b} 
    return info;
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity): Collision_Time_And_Normal | null {
    const simpA = this.entityToSimplifiedEntity(a);
    const simpB = this.entityToSimplifiedEntity(b);
    if(!a.hasTag("Player")) return null;
     const collision =  this.codeByGrok(simpA, simpB);
     return collision;
  }
  private static codeByGrok(a: Simplified_Enity, b: Simplified_Enity ): Collision_Time_And_Normal | null{

     const toLog= detectCollision(a, b, World_Tick.deltaTime);
   if(toLog) {
     console.log(a.vx, a.vy, b.vx, b.vy)
   
   if(toLog.time!==0) {
   console.log("from codeByGrok")
    
     console.log(toLog.time)
   }}
     return toLog;
  }
  static entityToSimplifiedEntity(entity: Base_Entity): Simplified_Enity {
     return {
       x: entity.x,
       y: entity.y,
       width: entity.width,
       height: entity.height,
       vx: entity.vx,
       vy: entity.vy,
     }
  }
}


type Rect = Simplified_Enity

type CollisionResult = null | Collision_Time_And_Normal;


export function detectCollision(
  entityA: Rect,
  entityB: Rect,
  deltaTime: number // ms per frame
): CollisionResult | null {
  // Convert velocities to units per frame
  const vx = (entityA.vx - entityB.vx) * deltaTime;
  const vy = (entityA.vy - entityB.vy) * deltaTime;

  //console.log('=== COLLISION DEBUG ===');
  //console.log('Relative velocity (per frame):', { vx, vy });

  // Already overlapping
  if (vx === 0 && vy === 0) {
    if (isOverlapping(entityA, entityB)) {
      //console.log('Already overlapping at t=0');
      return { time: 0, normal: { x: 0, y: 0 } };
    }
    //console.log('No relative movement and not overlapping');
    return null;
  }

  // Compute distances to entry and exit along each axis
  const xInvEntry = vx > 0
    ? entityB.x - (entityA.x + entityA.width)
    : (entityB.x + entityB.width) - entityA.x;

  const xInvExit = vx > 0
    ? (entityB.x + entityB.width) - entityA.x
    : entityB.x - (entityA.x + entityA.width);

  const yInvEntry = vy > 0
    ? entityB.y - (entityA.y + entityA.height)
    : (entityB.y + entityB.height) - entityA.y;

  const yInvExit = vy > 0
    ? (entityB.y + entityB.height) - entityA.y
    : entityB.y - (entityA.y + entityA.height);

  //console.log('Distances:', { xInvEntry, xInvExit, yInvEntry, yInvExit });

  // Compute entry and exit times
  let xEntry: number, xExit: number, yEntry: number, yExit: number;

  if (vx === 0) {
    if (xInvEntry > 0 || xInvExit < 0) {
      //console.log('No collision on X axis (vx=0)');
      return null;
    }
    xEntry = -Infinity;
    xExit = Infinity;
  } else {
    xEntry = xInvEntry / vx;
    xExit = xInvExit / vx;
    if (xEntry > xExit) [xEntry, xExit] = [xExit, xEntry];
  }

  if (vy === 0) {
    if (yInvEntry > 0 || yInvExit < 0) {
      //console.log('No collision on Y axis (vy=0)');
      return null;
    }
    yEntry = -Infinity;
    yExit = Infinity;
  } else {
    yEntry = yInvEntry / vy;
    yExit = yInvExit / vy;
    if (yEntry > yExit) [yEntry, yExit] = [yExit, yEntry];
  }

  //console.log('Entry/Exit times:', { xEntry, xExit, yEntry, yExit });

  const entryTime = Math.max(xEntry, yEntry);
  const exitTime = Math.min(xExit, yExit);

  //console.log('Computed entryTime:', entryTime, 'exitTime:', exitTime);

  if (entryTime > exitTime) {
    //console.log('No collision: entryTime > exitTime');
    return null;
  }
  if (exitTime < 0) {
    //console.log('No collision: already passed');
    return null;
  }
  if (entryTime > 1) {
    //console.log('No collision: occurs after this frame');
    return null;
  }

  const collisionTime = Math.max(0, entryTime);

  // Determine collision normal
  let normal = { x: 0, y: 0 };
  const epsilon = 1e-6;

  if (Math.abs(xEntry - yEntry) < epsilon) {
    if (Math.abs(vx) > Math.abs(vy)) {
      normal = vx > 0 ? { x: -1, y: 0 } : { x: 1, y: 0 };
    } else {
      normal = vy > 0 ? { x: 0, y: -1 } : { x: 0, y: 1 };
    }
  } else if (xEntry > yEntry) {
    normal = vx > 0 ? { x: -1, y: 0 } : { x: 1, y: 0 };
  } else {
    normal = vy > 0 ? { x: 0, y: -1 } : { x: 0, y: 1 };
  }

  //console.log('Collision normal:', normal, 'Collision time (0..1):', collisionTime);

  return { time: collisionTime, normal };
}

function isOverlapping(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}
