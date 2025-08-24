import type {Direction, Position, Collision_Info, Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Game_Loop } from "#root/Game_Loop.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };

class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    return this.implementation(a, b, 50);
  }

  private static implementation(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    const epsilon = 1e-4;

    const Amin = { x: a.x, y: a.y };
    const Amax = { x: a.x + a.width, y: a.y + a.height };
    const Bmin = { x: b.x, y: b.y };
    const Bmax = { x: b.x + b.width, y: b.y + b.height };

    const vRel = { x: a.vx - b.vx, y: a.vy - b.vy };

    function axisTimes(Amin: number, Amax: number, Bmin: number, Bmax: number, vRel: number) {
      if (vRel === 0) {
        if (Amax < Bmin || Amin > Bmax) return { tEntry: Infinity, tExit: -Infinity };
        return { tEntry: -Infinity, tExit: Infinity };
      }
      let t1 = (Bmin - Amax) / vRel;
      let t2 = (Bmax - Amin) / vRel;
      if (t1 > t2) [t1, t2] = [t2, t1];
      return { tEntry: t1, tExit: t2 };
    }

    const xTimes = axisTimes(Amin.x, Amax.x, Bmin.x, Bmax.x, vRel.x);
    const yTimes = axisTimes(Amin.y, Amax.y, Bmin.y, Bmax.y, vRel.y);

    const tEntry = Math.max(xTimes.tEntry, yTimes.tEntry);
    const tExit = Math.min(xTimes.tExit, yTimes.tExit);

    const collideAtStart =
      Amin.x < Bmax.x && Amax.x > Bmin.x && Amin.y < Bmax.y && Amax.y > Bmin.y;

    let collide = false;
    let tCollide = 1;

    if (!collideAtStart && tEntry <= tExit && tEntry >= 0 && tEntry <= 1) {
      collide = true;
      tCollide = tEntry;
    }

    if (!collide && !collideAtStart) return null;

    const endingA = { x: a.x + a.vx * dt, y: a.y + a.vy * dt };
    const endingB = { x: b.x + b.vx * dt, y: b.y + b.vy * dt };

    const t = collideAtStart ? 0 : tCollide;

    const posCollideA = { x: a.x + a.vx * dt * t, y: a.y + a.vy * dt * t };
    const posCollideB = { x: b.x + b.vx * dt * t, y: b.y + b.vy * dt * t };

    const tBefore = Math.max(0, t - epsilon);
    const posBeforeA = { x: a.x + a.vx * dt * tBefore, y: a.y + a.vy * dt * tBefore };
    const posBeforeB = { x: b.x + b.vx * dt * tBefore, y: b.y + b.vy * dt * tBefore };

    return {
      Theoretical_Ending_Position_A: endingA,
      Theoretical_Ending_Position_B: endingB,
      entityA: a,
      entityB: b,
      Position_Just_Before_Collision_A: posBeforeA,
      Position_Just_Before_Collision_B: posBeforeB,
      collideAtStart,
      collideAtLast: collide,
    };
  }
}
