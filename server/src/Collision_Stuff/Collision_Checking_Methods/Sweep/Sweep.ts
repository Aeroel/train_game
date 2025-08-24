import type {Direction, Position, 
Collision_Info,
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Game_Loop } from "#root/Game_Loop.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };
/*
// { begin
type Collision_Info =  {
  entityA: Base_Entity;
  entityB: Base_Entity;
  time: number;
  // theoretical ending positions if there was no collision
  Theoretical_Ending_Position_A: Position;
  Theoretical_Ending_Position_B: Position;
  // positions just before the collision (a small epsilon back)
  Position_Just_Before_Collision_A: Position;
  Position_Just_Before_Collision_B: Position;

  collideAtStart: boolean;
  // Whether the entities actually collide at the positions that are supposedly "just before collision" positions. this can happen if a player is walking on top of a car (collideAtStart true collideAtJustBefore true) entity or just entered car (collideAtStart false, collideAtJustBefore true) , for example. (Remember, this is a topdown rts style game, not a platformer game) While in some resolution methods like between wall and player (where player can never push wall, while the wall might be moving if it is a car wall, so it must push player, not just stop player) I will make sure the player does not collide with anything at end of every tick and assert that collideAtJustBefore is false (if not false, this means reoslution on previous ticks was invalidly handled or even that the collision detection algorithm's logic is faulty and returned invalid results while resolution's logic is fine, or even  both might be broken.)
  collideAtJustBefore: boolean;
}

class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    return this.implementationCode(a, b, dt);
  }

 
  private static implementationCode(a: Base_Entity, b: Base_Entity, dt: number, ): Collision_Info | null {
    // Todo: implement
    return null;
  }

}

// } end
*/



class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    return this.implementationCode(a, b, dt);
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity, dt: number): Collision_Info | null {
    // Check if already colliding at start
    const collideAtStart = this.checkAABBCollision(
      a.x, a.y, a.width, a.height,
      b.x, b.y, b.width, b.height
    );

    if (collideAtStart) {
      return this.createCollisionInfo(a, b, 0, dt, collideAtStart);
    }

    // Calculate relative velocity
    const relVx = a.vx - b.vx;
    const relVy = a.vy - b.vy;

    // If no relative movement, no future collision
    if (Math.abs(relVx) < 1e-10 && Math.abs(relVy) < 1e-10) {
      return null;
    }

    // Calculate the time of collision using swept AABB
    const collisionTime = this.calculateSweptCollision(a, b, relVx, relVy, dt);

    if (collisionTime === null) {
      return null;
    }

    return this.createCollisionInfo(a, b, collisionTime, dt, collideAtStart);
  }

  private static calculateSweptCollision(
    a: Base_Entity,
    b: Base_Entity,
    relVx: number,
    relVy: number,
    dt: number
  ): number | null {
    // Get AABB bounds
    const aLeft = a.x;
    const aRight = a.x + a.width;
    const aTop = a.y;
    const aBottom = a.y + a.height;

    const bLeft = b.x;
    const bRight = b.x + b.width;
    const bTop = b.y;
    const bBottom = b.y + b.height;

    // Calculate when A will enter and exit B's extended bounds on each axis
    let xInvEntry: number, yInvEntry: number;
    let xInvExit: number, yInvExit: number;

    // X-axis calculations
    if (relVx > 0) {
      xInvEntry = bLeft - aRight;
      xInvExit = bRight - aLeft;
    } else if (relVx < 0) {
      xInvEntry = bRight - aLeft;
      xInvExit = bLeft - aRight;
    } else {
      // No relative movement on X axis
      if (aRight <= bLeft || aLeft >= bRight) {
        return null; // No overlap possible on X axis
      }
      xInvEntry = -Infinity;
      xInvExit = Infinity;
    }

    // Y-axis calculations
    if (relVy > 0) {
      yInvEntry = bTop - aBottom;
      yInvExit = bBottom - aTop;
    } else if (relVy < 0) {
      yInvEntry = bBottom - aTop;
      yInvExit = bTop - aBottom;
    } else {
      // No relative movement on Y axis
      if (aBottom <= bTop || aTop >= bBottom) {
        return null; // No overlap possible on Y axis
      }
      yInvEntry = -Infinity;
      yInvExit = Infinity;
    }

    // Calculate entry and exit times
    let xEntry: number, yEntry: number;
    let xExit: number, yExit: number;

    if (Math.abs(relVx) > 1e-10) {
      xEntry = xInvEntry / relVx;
      xExit = xInvExit / relVx;
    } else {
      xEntry = xInvEntry;
      xExit = xInvExit;
    }

    if (Math.abs(relVy) > 1e-10) {
      yEntry = yInvEntry / relVy;
      yExit = yInvExit / relVy;
    } else {
      yEntry = yInvEntry;
      yExit = yInvExit;
    }

    // Find the latest entry time and earliest exit time
    const entryTime = Math.max(xEntry, yEntry);
    const exitTime = Math.min(xExit, yExit);

    // Check if collision occurs within time frame
    if (entryTime > exitTime || entryTime < 0 || entryTime > dt) {
      return null;
    }

    return entryTime;
  }

  private static createCollisionInfo(
    a: Base_Entity,
    b: Base_Entity,
    collisionTime: number,
    dt: number,
    collideAtStart: boolean
  ): Collision_Info {
    // Calculate theoretical ending positions
    const theoreticalEndA: Position = {
      x: a.x + a.vx * dt,
      y: a.y + a.vy * dt
    };

    const theoreticalEndB: Position = {
      x: b.x + b.vx * dt,
      y: b.y + b.vy * dt
    };

    // Calculate dynamic epsilon based on velocities to ensure positions are never negative
    const maxSpeed = Math.max(
      Math.abs(a.vx), Math.abs(a.vy),
      Math.abs(b.vx), Math.abs(b.vy)
    );
    
    // Use a dynamic epsilon that scales with speed but has reasonable bounds
    // Make epsilon smaller to reduce chance of false overlap
    const epsilon = Math.max(1e-12, Math.min(0.0001, maxSpeed * 1e-10));

    // Calculate positions just before collision
    const timeJustBefore = Math.max(0, collisionTime - epsilon);
    
    const justBeforeA: Position = {
      x: Math.max(0, a.x + a.vx * timeJustBefore),
      y: Math.max(0, a.y + a.vy * timeJustBefore)
    };

    const justBeforeB: Position = {
      x: Math.max(0, b.x + b.vx * timeJustBefore),
      y: Math.max(0, b.y + b.vy * timeJustBefore)
    };

    // Check if entities collide at "just before" positions
    // Use a tiny tolerance to handle floating point precision issues
    const collideAtJustBefore = this.checkAABBCollisionWithTolerance(
      justBeforeA.x, justBeforeA.y, a.width, a.height,
      justBeforeB.x, justBeforeB.y, b.width, b.height,
      1e-10
    );

    return {
      entityA: a,
      entityB: b,
      time: collisionTime,
      Theoretical_Ending_Position_A: theoreticalEndA,
      Theoretical_Ending_Position_B: theoreticalEndB,
      Position_Just_Before_Collision_A: justBeforeA,
      Position_Just_Before_Collision_B: justBeforeB,
      collideAtStart,
      collideAtJustBefore
    };
  }

  private static checkAABBCollision(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ): boolean {
    return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
  }

  private static checkAABBCollisionWithTolerance(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number,
    tolerance: number = 1e-10
  ): boolean {
    // Add tolerance to prevent floating-point precision issues from causing false overlaps
    return !(x1 + w1 <= x2 + tolerance || 
             x2 + w2 <= x1 + tolerance || 
             y1 + h1 <= y2 + tolerance || 
             y2 + h2 <= y1 + tolerance);
  }
}
/*
// Debug helper function
function debugCollisionCheck(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number,
  label: string = ""
) {
  const overlap = !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
  console.log(`${label} AABB Check:`);
  console.log(`  A: (${x1}, ${y1}) to (${x1 + w1}, ${y1 + h1}) [w=${w1}, h=${h1}]`);
  console.log(`  B: (${x2}, ${y2}) to (${x2 + w2}, ${y2 + h2}) [w=${w2}, h=${h2}]`);
  console.log(`  Overlap: ${overlap}`);
  console.log(`  Details: x1+w1=${x1+w1} <= x2=${x2}? ${x1+w1 <= x2}`);
  console.log(`           x2+w2=${x2+w2} <= x1=${x1}? ${x2+w2 <= x1}`);
  console.log(`           y1+h1=${y1+h1} <= y2=${y2}? ${y1+h1 <= y2}`);
  console.log(`           y2+h2=${y2+h2} <= y1=${y1}? ${y2+h2 <= y1}`);
  return overlap;
}

// Tests with expected vs actual results
function runTests() {
  console.log("Running collision detection tests with Expected vs Actual results...\n");
  
  // Debug Test: Check simple non-overlapping case
  console.log("=== DEBUG: Simple non-overlapping case ===");
  const debugA = { x: 0, y: 0, vx: 10, vy: 0, width: 10, height: 10 };
  const debugB = { x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 };
  
  console.log("Initial positions (should NOT overlap):");
  debugCollisionCheck(debugA.x, debugA.y, debugA.width, debugA.height, 
                     debugB.x, debugB.y, debugB.width, debugB.height, "Start");
  
  const debugResult = Sweep.Check_For_Collision(debugA, debugB, 1);
  if (debugResult) {
    console.log(`\nCollision found at t=${debugResult.time}`);
    console.log(`collideAtStart: ${debugResult.collideAtStart}`);
    console.log(`collideAtJustBefore: ${debugResult.collideAtJustBefore}`);
    console.log("\nJust before collision positions:");
    debugCollisionCheck(
      debugResult.Position_Just_Before_Collision_A.x, 
      debugResult.Position_Just_Before_Collision_A.y,
      debugA.width, debugA.height,
      debugResult.Position_Just_Before_Collision_B.x,
      debugResult.Position_Just_Before_Collision_B.y,
      debugB.width, debugB.height,
      "Just Before"
    );
  } else {
    console.log("No collision detected");
  }
  console.log("\n" + "=".repeat(50) + "\n");

  // Test 1: Simple horizontal collision
  console.log("=== Test 1: Simple horizontal collision ===");
  const entityA1: Base_Entity = { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 };
  const entityB1: Base_Entity = { x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 };
  
  console.log("Initial collision check:");
  const startCollision1 = Sweep['checkAABBCollision'](
    entityA1.x, entityA1.y, entityA1.width, entityA1.height,
    entityB1.x, entityB1.y, entityB1.width, entityB1.height
  );
  console.log(`Should be false: ${startCollision1}`);
  
  const result1 = Sweep.Check_For_Collision(entityA1, entityB1, 1);
  console.log("EXPECTED: Collision at t = 0.4, collideAtStart=false, collideAtJustBefore=false");
  console.log("ACTUAL:  ", result1 ? `Collision at time ${result1.time.toFixed(6)}, start=${result1.collideAtStart}, justBefore=${result1.collideAtJustBefore}` : "No collision");
  
  if (result1) {
    console.log("Just before positions check:");
    debugCollisionCheck(
      result1.Position_Just_Before_Collision_A.x, 
      result1.Position_Just_Before_Collision_A.y,
      entityA1.width, entityA1.height,
      result1.Position_Just_Before_Collision_B.x,
      result1.Position_Just_Before_Collision_B.y,
      entityB1.width, entityB1.height,
      "Just Before Test 1"
    );
  }
  console.log("CORRECT: ", result1 && Math.abs(result1.time - 0.4) < 0.001 && !result1.collideAtStart && !result1.collideAtJustBefore ? "✓" : "✗");
  console.log();

  // Test 2: High speed horizontal collision
  console.log("=== Test 2: High speed horizontal collision ===");
  const entityA2: Base_Entity = { x: 0, y: 0, vx: 999999, vy: 0, width: 10, height: 10 };
  const entityB2: Base_Entity = { x: 500, y: 0, vx: 0, vy: 0, width: 10, height: 10 };
  
  const result2 = Sweep.Check_For_Collision(entityA2, entityB2, 1);
  console.log("EXPECTED: Collision at t ≈ 0.00049 (A needs to move 490 units at speed 999999)");
  console.log("ACTUAL:  ", result2 ? `Collision at time ${result2.time.toFixed(10)}` : "No collision");
  console.log("CORRECT: ", result2 && result2.time > 0 && result2.time < 0.001 ? "✓" : "✗");
  console.log();

  // Test 3: Diagonal collision - both moving
  console.log("=== Test 3: Diagonal collision - both moving ===");
  const entityA3: Base_Entity = { x: 0, y: 0, vx: 50, vy: 50, width: 10, height: 10 };
  const entityB3: Base_Entity = { x: 100, y: 100, vx: -50, vy: -50, width: 10, height: 10 };
  
  const result3 = Sweep.Check_For_Collision(entityA3, entityB3, 1);
  console.log("EXPECTED: Collision (entities moving toward each other diagonally)");
  console.log("ACTUAL:  ", result3 ? `Collision at time ${result3.time.toFixed(6)}` : "No collision");
  console.log("CORRECT: ", result3 !== null ? "✓" : "✗");
  if (result3) {
    console.log(`Collision details: t=${result3.time.toFixed(6)}, collideAtStart=${result3.collideAtStart}`);
  }
  console.log();

  // Test 4: Already overlapping
  console.log("=== Test 4: Already overlapping ===");
  const entityA4: Base_Entity = { x: 0, y: 0, vx: 10, vy: 10, width: 20, height: 20 };
  const entityB4: Base_Entity = { x: 5, y: 5, vx: -5, vy: -5, width: 20, height: 20 };
  
  const result4 = Sweep.Check_For_Collision(entityA4, entityB4, 1);
  console.log("EXPECTED: Collision at t=0 (already overlapping)");
  console.log("ACTUAL:  ", result4 ? `Collision at time ${result4.time}, collideAtStart=${result4.collideAtStart}` : "No collision");
  console.log("CORRECT: ", result4 && result4.time === 0 && result4.collideAtStart ? "✓" : "✗");
  console.log();

  // Test 5: Parallel movement (no collision)
  console.log("=== Test 5: Parallel movement (no collision) ===");
  const entityA5: Base_Entity = { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 };
  const entityB5: Base_Entity = { x: 0, y: 20, vx: 100, vy: 0, width: 10, height: 10 };
  
  const result5 = Sweep.Check_For_Collision(entityA5, entityB5, 1);
  console.log("EXPECTED: No collision (moving parallel with gap)");
  console.log("ACTUAL:  ", result5 ? `Collision at time ${result5.time}` : "No collision");
  console.log("CORRECT: ", result5 === null ? "✓" : "✗");
  console.log();

  // Test 6: Both stationary, separated
  console.log("=== Test 6: Both stationary, separated ===");
  const entityA6: Base_Entity = { x: 0, y: 0, vx: 0, vy: 0, width: 10, height: 10 };
  const entityB6: Base_Entity = { x: 50, y: 50, vx: 0, vy: 0, width: 10, height: 10 };
  
  const result6 = Sweep.Check_For_Collision(entityA6, entityB6, 1);
  console.log("EXPECTED: No collision (both stationary and separated)");
  console.log("ACTUAL:  ", result6 ? `Collision at time ${result6.time}` : "No collision");
  console.log("CORRECT: ", result6 === null ? "✓" : "✗");
  console.log();

  // Test 7: Touching entities, one moving
  console.log("=== Test 7: Touching entities, one moving ===");
  const entityA7: Base_Entity = { x: 0, y: 0, vx: 10, vy: 0, width: 10, height: 10 };
  const entityB7: Base_Entity = { x: 10, y: 0, vx: 0, vy: 0, width: 10, height: 10 };
  
  const result7 = Sweep.Check_For_Collision(entityA7, entityB7, 1);
  console.log("EXPECTED: Collision at t=0 (touching and A moving toward B)");
  console.log("ACTUAL:  ", result7 ? `Collision at time ${result7.time.toFixed(10)}` : "No collision");
  console.log("CORRECT: ", result7 && result7.time < 0.001 ? "✓" : "✗");
  console.log();

  // Test 8: Moving away from each other
  console.log("=== Test 8: Moving away from each other ===");
  const entityA8: Base_Entity = { x: 0, y: 0, vx: -50, vy: 0, width: 10, height: 10 };
  const entityB8: Base_Entity = { x: 20, y: 0, vx: 50, vy: 0, width: 10, height: 10 };
  
  const result8 = Sweep.Check_For_Collision(entityA8, entityB8, 1);
  console.log("EXPECTED: No collision (moving away from each other)");
  console.log("ACTUAL:  ", result8 ? `Collision at time ${result8.time}` : "No collision");
  console.log("CORRECT: ", result8 === null ? "✓" : "✗");
  console.log();

  // Test 9: Vertical collision
  console.log("=== Test 9: Vertical collision ===");
  const entityA9: Base_Entity = { x: 0, y: 0, vx: 0, vy: 100, width: 10, height: 10 };
  const entityB9: Base_Entity = { x: 0, y: 50, vx: 0, vy: 0, width: 10, height: 10 };
  
  const result9 = Sweep.Check_For_Collision(entityA9, entityB9, 1);
  console.log("EXPECTED: Collision at t = 0.4 (A needs to move 40 units vertically at speed 100)");
  console.log("ACTUAL:  ", result9 ? `Collision at time ${result9.time.toFixed(6)}` : "No collision");
  console.log("CORRECT: ", result9 && Math.abs(result9.time - 0.4) < 0.001 ? "✓" : "✗");
  console.log();

  // Test 10: Non-negative position verification
  console.log("=== Test 10: Non-negative position verification ===");
  const entityA10: Base_Entity = { x: 10, y: 10, vx: -1000, vy: -1000, width: 5, height: 5 };
  const entityB10: Base_Entity = { x: 0, y: 0, vx: 0, vy: 0, width: 5, height: 5 };
  
  const result10 = Sweep.Check_For_Collision(entityA10, entityB10, 1);
  console.log("EXPECTED: Collision with all positions >= 0");
  if (result10) {
    const allNonNegative = result10.Position_Just_Before_Collision_A.x >= 0 &&
                          result10.Position_Just_Before_Collision_A.y >= 0 &&
                          result10.Position_Just_Before_Collision_B.x >= 0 &&
                          result10.Position_Just_Before_Collision_B.y >= 0;
    console.log("ACTUAL:  ", `Collision at t=${result10.time.toFixed(10)}, all positions non-negative: ${allNonNegative}`);
    console.log("CORRECT: ", allNonNegative ? "✓" : "✗");
    console.log(`Just before A: (${result10.Position_Just_Before_Collision_A.x.toFixed(6)}, ${result10.Position_Just_Before_Collision_A.y.toFixed(6)})`);
  } else {
    console.log("ACTUAL:   No collision");
    console.log("CORRECT:  ✗");
  }
  console.log();

  console.log("=== Test Summary ===");
  console.log("Check the ✓/✗ marks above to see which tests passed/failed");
}

// Run the tests
runTests();
*/