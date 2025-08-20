import type { Direction, Position, Collision_Info } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Game_Loop } from "#root/Game_Loop.js";

export { Swept2_Test };

class Swept2_Test {
  static Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
    const startA: Position = { x: entityA.x, y: entityA.y };
    const startB: Position = { x: entityB.x, y: entityB.y };

    // Relative displacement this frame
    const relDx = (entityA.velocity.x.get() - entityB.velocity.x.get()) * Game_Loop.deltaTime;
    const relDy = (entityA.velocity.y.get() - entityB.velocity.y.get()) * Game_Loop.deltaTime;

    const minA = { x: startA.x, y: startA.y };
    const maxA = { x: startA.x + entityA.width, y: startA.y + entityA.height };
    const minB = { x: startB.x, y: startB.y };
    const maxB = { x: startB.x + entityB.width, y: startB.y + entityB.height };

    const axisTimes = (minA: number, maxA: number, minB: number, maxB: number, v: number) => {
      if (v === 0) {
        if (maxA <= minB || minA >= maxB) return { tEnter: Infinity, tExit: -Infinity };
        return { tEnter: -Infinity, tExit: Infinity };
      }
      const tEnter = v > 0 ? (minB - maxA) / v : (maxB - minA) / v;
      const tExit = v > 0 ? (maxB - minA) / v : (minB - maxA) / v;
      return { tEnter, tExit };
    };

    const xTimes = axisTimes(minA.x, maxA.x, minB.x, maxB.x, relDx);
    const yTimes = axisTimes(minA.y, maxA.y, minB.y, maxB.y, relDy);

    const tEnter = Math.max(xTimes.tEnter, yTimes.tEnter);
    const tExit = Math.min(xTimes.tExit, yTimes.tExit);

    // No collision if intervals don't overlap
    if (tEnter > tExit || tExit < 0) return null;

    // Already overlapping at start
    const overlapNow =
      maxA.x > minB.x &&
      minA.x < maxB.x &&
      maxA.y > minB.y &&
      minA.y < maxB.y;

    const t = overlapNow ? 0 : Math.max(tEnter, 0);

    const collisionA: Position = {
      x: startA.x + relDx * t,
      y: startA.y + relDy * t
    };

    const collisionB: Position = {
      x: startB.x + (entityB.velocity.x.get() * Game_Loop.deltaTime),
      y: startB.y + (entityB.velocity.y.get() * Game_Loop.deltaTime)
    };

    const bFacingA: Direction = Swept2_Test.computeBFacingA(xTimes, yTimes, relDx, relDy);

    return {
      Starting_Position_A: startA,
      Starting_Position_B: startB,
      Theoretical_Ending_Position_A: { x: startA.x + relDx, y: startA.y + relDy },
      Theoretical_Ending_Position_B: collisionB,
      entityA,
      entityB,
      Position_Just_Before_Collision_A: collisionA,
      Position_Just_Before_Collision_B: collisionB,
      Last_Box_Just_Before_Collision_A: { x: collisionA.x, y: collisionA.y, width: entityA.width, height: entityA.height },
      Last_Box_Just_Before_Collision_B: { x: collisionB.x, y: collisionB.y, width: entityB.width, height: entityB.height },
      bFacingA,
      aFacingB: Helper_Functions.getOppositeDirection(bFacingA)
    };
  }

  private static computeBFacingA(
    xTimes: { tEnter: number, tExit: number },
    yTimes: { tEnter: number, tExit: number },
    relDx: number,
    relDy: number
  ): Direction {
    if (xTimes.tEnter > yTimes.tEnter) return relDx > 0 ? "left" : "right";
    if (yTimes.tEnter > xTimes.tEnter) return relDy > 0 ? "up" : "down";
    return Math.abs(relDx) > Math.abs(relDy) ? (relDx > 0 ? "left" : "right") : (relDy > 0 ? "up" : "down");
  }
}
