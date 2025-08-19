import type {Direction, Position, Collision_Info, Box} from "#root/Type_Stuff.js";
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import {Helper_Functions} from "#root/Helper_Functions.js"

export {Swept2_Test};

class Swept2_Test {
  static Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
    const startA: Position = {x: entityA.x, y: entityA.y};
    const startB: Position = {x: entityB.x, y: entityB.y};

    const endA: Position = {
      x: startA.x + entityA.velocity.x.get(),
      y: startA.y + entityA.velocity.y.get()
    };
    const endB: Position = {
      x: startB.x + entityB.velocity.x.get(),
      y: startB.y + entityB.velocity.y.get()
    };

    const relVel = {
      x: (endA.x - startA.x) - (endB.x - startB.x),
      y: (endA.y - startA.y) - (endB.y - startB.y)
    };

    // Swept AABB helper
    const axisTimes = (minA: number, maxA: number, minB: number, maxB: number, v: number) => {
      if (v === 0) {
        if (maxA < minB || minA > maxB) return {tEnter: Infinity, tExit: -Infinity};
        return {tEnter: -Infinity, tExit: Infinity};
      }
      const tEnter = (v > 0 ? minB - maxA : maxB - minA) / v;
      const tExit = (v > 0 ? maxB - minA : minB - maxA) / v;
      return {tEnter, tExit};
    };

    const xTimes = axisTimes(startA.x, startA.x + entityA.width, startB.x, startB.x + entityB.width, relVel.x);
    const yTimes = axisTimes(startA.y, startA.y + entityA.height, startB.y, startB.y + entityB.height, relVel.y);

    const tEnter = Math.max(xTimes.tEnter, yTimes.tEnter);
    const tExit = Math.min(xTimes.tExit, yTimes.tExit);

    // Already overlapping or about to collide
    if (tEnter <= tExit && tExit >= 0 && tEnter <= 1) {
      const clampedT = Math.max(tEnter, 0); // ensures collision happens within frame

      const collisionA: Position = {
        x: startA.x + (endA.x - startA.x) * clampedT,
        y: startA.y + (endA.y - startA.y) * clampedT
      };
      const collisionB: Position = {
        x: startB.x + (endB.x - startB.x) * clampedT,
        y: startB.y + (endB.y - startB.y) * clampedT
      };

      const bFacingA: Direction = Swept2_Test.computeBFacingA(xTimes, yTimes, relVel);
      const aFacingB = Helper_Functions.getOppositeDirection(bFacingA);

      return {
        Starting_Position_A: startA,
        Starting_Position_B: startB,
        Theoretical_Ending_Position_A: endA,
        Theoretical_Ending_Position_B: endB,
        entityA,
        entityB,
        Position_Just_Before_Collision_A: collisionA,
        Position_Just_Before_Collision_B: collisionB,
        Last_Box_Just_Before_Collision_A: {x: collisionA.x, y: collisionA.y, width: entityA.width, height: entityA.height},
        Last_Box_Just_Before_Collision_B: {x: collisionB.x, y: collisionB.y, width: entityB.width, height: entityB.height},
        bFacingA, 
        aFacingB
      };
    }

    return null;
  }

  private static computeBFacingA(
    xTimes: {tEnter: number, tExit: number},
    yTimes: {tEnter: number, tExit: number},
    relVel: {x: number, y: number}
  ): Direction {
    if (xTimes.tEnter > yTimes.tEnter) return relVel.x > 0 ? "left" : "right";
    if (yTimes.tEnter > xTimes.tEnter) return relVel.y > 0 ? "up" : "down";
    return Math.abs(relVel.x) > Math.abs(relVel.y) ? (relVel.x > 0 ? "left" : "right") : (relVel.y > 0 ? "up" : "down");
  }
}
