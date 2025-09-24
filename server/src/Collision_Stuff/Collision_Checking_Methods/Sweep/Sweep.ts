import type {
  Direction,
  Position,
  Collision_Time_And_Normal,
  Simplified_Enity,
  Collision_Info,
  Normal,
  Box_With_Velocity,
  Box
} from "#root/Type_Stuff.js";
import {
  Collision_Stuff
} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {
  Base_Entity
} from "#root/Entities/Base_Entity.js";
import {
  Helper_Functions
} from "#root/Helper_Functions.js";
import {
  World_Tick
} from "#root/World_Tick.js";
import {
  My_Assert
} from "#root/My_Assert.js"
import {
  log
} from "#root/My_Log.js"


export {
  Sweep
};


class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    const primary = this.implementationCode(a, b);
    if (!primary) return null;
    const info = {
      ...primary,
      entityA: a,
      entityB: b
    }
    return info;
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity): Collision_Time_And_Normal | null {

    const collision = this.codeByMe(a, b);

    return collision;
  }

  private static codeByMe(a: Base_Entity, b: Base_Entity): Collision_Time_And_Normal | null {
    let rectA = Collision_Stuff.entityToBoxWithVelocity(a);
    let rectB = Collision_Stuff.entityToBoxWithVelocity(b);

    const dt = World_Tick.deltaTime;
    const result = mySweep(rectA, rectB, dt);
    return result;
  }



}

type Swept_Result = null | {
  time: number;
  normal: {
    x: number,
    y: number
  }
}


// dt is used for creating the expanded box
export function mySweep(a: Box_With_Velocity, b: Box_With_Velocity, deltaTime: number,): Swept_Result {

  let result: Swept_Result = {
    time: 0,
    normal: {
      x: 0,
      y: 0
    }};
  if (overlap(a, b)) {
    result = {
      time: 0,
      normal: {
        x: 0,
        y: 0
      }}
    return result;
  }
  const relx = a.vx - b.vx;
  const rely = a.vy - b.vy;

  // collision impossible if no overlap and no relative velocity
  if (relx === 0 && rely === 0) {
    result = null
    return null
  }
  const expA = expandByVel(a, relx, rely, deltaTime)
  if (!overlap(expA, b)) {
    return null
  }

  let xTime0: number = 0;
  let xTime100: number = 0;
  let xOverlapStartPercent = -Infinity
  let xOverlapEndPercent = Infinity
  let xOverlapStartPoint: number = 0;
  let xOverlapEndPoint: number = 0;
  if (relx < 0) {
    xTime0 = expA.x + expA.width;
    xTime100 = expA.x
    xOverlapStartPoint = b.x + b.width+ a.width;
    xOverlapEndPoint = b.x - a.width;

  }
  if (relx > 0) {
    xTime0 = expA.x;
    xTime100 = expA.x + expA.width
    xOverlapStartPoint = b.x - a.width;
    xOverlapEndPoint = b.x + b.width + a.width;
  }
  if (relx !== 0) {
    xOverlapStartPercent = percentOf(xOverlapStartPoint, xTime0, xTime100)
    xOverlapEndPercent = percentOf(xOverlapEndPoint, xTime0, xTime100)

  }

  let yTime0: number = 0;
  let yTime100: number = 0;
  let yOverlapStartPercent = -Infinity;
  let yOverlapEndPercent = Infinity;
  let yOverlapStartPoint: number = 0;
  let yOverlapEndPoint: number = 0;
  if (rely > 0) {
    yTime0 = expA.y;
    yTime100 = expA.y + expA.height
    yOverlapStartPoint = b.y - a.height;
    yOverlapEndPoint = b.y + b.height + a.height;
  }
  if (rely < 0) {
    yTime0 = expA.y + expA.height;
    yTime100 = expA.y
    yOverlapStartPoint = b.y + b.height + a.height;
    yOverlapEndPoint = b.y - a.height;
  }
  if (rely !== 0) {
    yOverlapStartPercent = percentOf(yOverlapStartPoint, yTime0, yTime100)
    yOverlapEndPercent = percentOf(yOverlapEndPoint, yTime0, yTime100)
  }

  const overlapStartPercent = Math.max(xOverlapStartPercent, yOverlapStartPercent)
  const overlapEndPercent = Math.min(xOverlapEndPercent, yOverlapEndPercent);
  if (overlapStartPercent > overlapEndPercent) {
    return null;
  }
  const overlapStartNormalizedTime = overlapStartPercent / 100;
  const normal = preferXIfDiagonal(calculateNormal(xOverlapStartPercent, yOverlapStartPercent, relx, rely));
  
  log('relx:', relx, 'rely:', rely);
log('xOverlapStartPercent:', xOverlapStartPercent, 'xOverlapEndPercent:', xOverlapEndPercent);
log('yOverlapStartPercent:', yOverlapStartPercent, 'yOverlapEndPercent:', yOverlapEndPercent);
log('expA:',expA)

  return {
    time: overlapStartNormalizedTime,
    normal
  };

}


export function percentOf(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}
export function overlap(a: Box, b: Box) {

  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}
export function expandByVel(entity: Box, vx: number, vy: number, deltaTime: number): Box {
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
export function calculateNormal(xOverlapStartPercent: number, yOverlapStartPercent: number, relx: number, rely: number) {
  const normal: Normal = {
    x: 0,
    y: 0
  };

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
export function preferXIfDiagonal(normal: Normal) {

  if (normal.x !== 0 && normal.y !== 0) {
    console.log("diagonal normal")
    return {
      ...normal,
      y: 0,
    }
  }
  return normal;
}


/**
 * Symmetric swept AABB using relative velocity.
 * Returns null for no collision in [0, deltaTime].
 * If overlapping at t=0 returns {time:0, normal:{0,0}}.
 */
export function gptSweep(
  boxA: Box_With_Velocity,
  boxB: Box_With_Velocity,
  deltaTime: number
): Swept_Result | null {
  // immediate overlap
  if (overlap(boxA, boxB)) {
    return { time: 0, normal: { x: 0, y: 0 } };
  }

  // relative velocity: treat A moving, B stationary
  const relx = boxA.vx - boxB.vx;
  const rely = boxA.vy - boxB.vy;

  // if no relative motion -> no future collision
  if (relx === 0 && rely === 0) return null;

  // compute inverse entry/exit distances on X
  const xInvEntry =
    relx > 0 ? boxB.x - (boxA.x + boxA.width) : (boxB.x + boxB.width) - boxA.x;
  const xInvExit =
    relx > 0 ? (boxB.x + boxB.width) - boxA.x : boxB.x - (boxA.x + boxA.width);

  // compute inverse entry/exit distances on Y
  const yInvEntry =
    rely > 0
      ? boxB.y - (boxA.y + boxA.height)
      : (boxB.y + boxB.height) - boxA.y;
  const yInvExit =
    rely > 0
      ? (boxB.y + boxB.height) - boxA.y
      : boxB.y - (boxA.y + boxA.height);

  // times (seconds). If velocity is zero on an axis, set entry/exit to +/- Infinity
  const xEntry = relx === 0 ? -Infinity : xInvEntry / relx;
  const xExit = relx === 0 ? Infinity : xInvExit / relx;
  const yEntry = rely === 0 ? -Infinity : yInvEntry / rely;
  const yExit = rely === 0 ? Infinity : yInvExit / rely;

  // earliest/latest times of contact
  const entryTime = Math.max(xEntry, yEntry);
  const exitTime = Math.min(xExit, yExit);

  // no collision if there is no overlap time window or it's outside [0, deltaTime]
  if (entryTime > exitTime) return null;
  if (entryTime > deltaTime || exitTime < 0) return null;

  // normalized time in [0,1] relative to deltaTime
  const normalizedTime = clamp01(entryTime <= 0 ? 0 : entryTime / deltaTime);

  // compute normal. prefer X when tie or when xEntry >= yEntry
  const normal: Normal = { x: 0, y: 0 };
  if (xEntry >= yEntry) {
    // collision happened on X axis
    normal.x = relx > 0 ? -1 : 1; // moving right -> hit left side of B
  } else {
    // collision happened on Y axis
    normal.y = rely > 0 ? -1 : 1; // moving down -> hit top of B
  }

  return { time: normalizedTime, normal };
}

/* --- helpers --- */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

