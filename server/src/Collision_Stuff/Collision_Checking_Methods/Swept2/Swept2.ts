import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Collision_Info } from "#root/Type_Stuff.js";


export class Swept2 {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity) {
    return sweptAABB(a, b)
  }
}
function sweptAABB(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
    // Extract positions, velocities, and box dimensions
    const a = {
        x: entityA.x,
        y: entityA.y,
        vx: entityA.velocity.x.get(),
        vy: entityA.velocity.y.get(),
        w: entityA.width,
        h: entityA.height
    };
    
    const b = {
        x: entityB.x,
        y: entityB.y,
        vx: entityB.velocity.x.get(),
        vy: entityB.velocity.y.get(),
        w: entityB.width,
        h: entityB.height
    };

    // Calculate relative velocity
    const rvx = a.vx - b.vx;
    const rvy = a.vy - b.vy;

    // Calculate theoretical ending positions
    const endA = {
        x: a.x + a.vx,
        y: a.y + a.vy
    };
    
    const endB = {
        x: b.x + b.vx,
        y: b.y + b.vy
    };

    // Expand stationary box (B) by moving box (A)
    const expandedBox = {
        left: b.x - a.w,
        right: b.x + b.w,
        top: b.y - a.h,
        bottom: b.y + b.h
    };

    // Calculate entry/exit times for X axis
    let txEntry, txExit;
    if (rvx === 0) {
        if (a.x <= expandedBox.left || a.x >= expandedBox.right) return null;
        txEntry = Number.NEGATIVE_INFINITY;
        txExit = Number.POSITIVE_INFINITY;
    } else {
        txEntry = (expandedBox.left - a.x) / rvx;
        txExit = (expandedBox.right - a.x) / rvx;
        if (txEntry > txExit) [txEntry, txExit] = [txExit, txEntry];
    }

    // Calculate entry/exit times for Y axis
    let tyEntry, tyExit;
    if (rvy === 0) {
        if (a.y <= expandedBox.top || a.y >= expandedBox.bottom) return null;
        tyEntry = Number.NEGATIVE_INFINITY;
        tyExit = Number.POSITIVE_INFINITY;
    } else {
        tyEntry = (expandedBox.top - a.y) / rvy;
        tyExit = (expandedBox.bottom - a.y) / rvy;
        if (tyEntry > tyExit) [tyEntry, tyExit] = [tyExit, tyEntry];
    }

    // Calculate earliest collision time
    const entryTime = Math.max(txEntry, tyEntry);
    const exitTime = Math.min(txExit, tyExit);

    // Check for valid collision window
    if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
        return null;
    }

    // FIX 1: Use a larger time step back and don't round collision positions
    const timeStepBack = Math.max(0.01, Math.min(0.1, entryTime * 0.1)); // 1-10% of collision time, min 0.01
    const safeTime = Math.max(0, entryTime - timeStepBack);

    // Calculate positions just before collision (FIXED: use actual velocities, not relative)
    const beforePosA = {
        x: Math.floor(a.x + a.vx * safeTime), // Use a.vx, not rvx
        y: Math.floor(a.y + a.vy * safeTime)  // Use a.vy, not rvy
    };

    const beforePosB = {
        x: Math.floor(b.x + b.vx * safeTime), // Use b.vx
        y: Math.floor(b.y + b.vy * safeTime)  // Use b.vy
    };

    // FIX 2: Don't round collision positions - keep them precise
    const collisionPosA = {
        x: a.x + a.vx * entryTime, // No rounding
        y: a.y + a.vy * entryTime
    };

    const collisionPosB = {
        x: b.x + b.vx * entryTime, // No rounding
        y: b.y + b.vy * entryTime
    };

    // Create collision info object
    return {
        Starting_Position_A: {x: a.x, y: a.y},
        Starting_Position_B: {x: b.x, y: b.y},
        Theoretical_Ending_Position_A: {x: endA.x, y: endA.y},
        Theoretical_Ending_Position_B: {x: endB.x, y: endB.y},
        entityA: entityA,
        entityB: entityB,
        Position_Just_Before_Collision_A: beforePosA,
        Position_Just_Before_Collision_B: beforePosB,
        Last_Box_Just_Before_Collision_A: {
            x: beforePosA.x,
            y: beforePosA.y,
            width: a.w,
            height: a.h
        },
        Last_Box_Just_Before_Collision_B: {
            x: beforePosB.x,
            y: beforePosB.y,
            width: b.w,
            height: b.h
        }
    };
}