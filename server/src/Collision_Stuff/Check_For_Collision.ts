import type { Position, Collision_Info, Box } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";



export function Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
  // Get starting positions
  const startA: Position = { x: entityA.x, y: entityA.y };
  const startB: Position = { x: entityB.x, y: entityB.y };
  
  // Calculate theoretical ending positions based on next movement
  const endA = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
  const endB = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();
  
  // If neither entity is moving, check if they're already colliding
  const aMoving = startA.x !== endA.x || startA.y !== endA.y;
  const bMoving = startB.x !== endB.x || startB.y !== endB.y;
  
  if (!aMoving && !bMoving) {
    if (areBoxesOverlapping(
      { x: startA.x, y: startA.y, width: entityA.width, height: entityA.height },
      { x: startB.x, y: startB.y, width: entityB.width, height: entityB.height }
    )) {
      return {
        Starting_Position_A: startA,
        Starting_Position_B: startB,
        Theoretical_Ending_Position_A: endA,
        Theoretical_Ending_Position_B: endB,
        entityA,
        entityB,
        Position_Just_Before_Collision_A: startA,
        Position_Just_Before_Collision_B: startB,
        Last_Box_Just_Before_Collision_A: { x: startA.x, y: startA.y, width: entityA.width, height: entityA.height },
        Last_Box_Just_Before_Collision_B: { x: startB.x, y: startB.y, width: entityB.width, height: entityB.height }
      };
    }
    return null;
  }
  
  // Perform swept AABB collision detection
  const collisionTime = getSweptAABBCollisionTime(
    { x: startA.x, y: startA.y, width: entityA.width, height: entityA.height },
    { x: endA.x - startA.x, y: endA.y - startA.y }, // velocity A
    { x: startB.x, y: startB.y, width: entityB.width, height: entityB.height },
    { x: endB.x - startB.x, y: endB.y - startB.y }  // velocity B
  );
  
  // If no collision occurs, return null
  if (collisionTime === null || collisionTime < 0 || collisionTime > 1) {
    return null;
  }
  
  // Calculate positions just before collision (with a tiny offset to prevent overlap)
  const epsilon = 0.001;
  const timeBeforeCollision = Math.max(0, collisionTime - epsilon);
  
  const positionBeforeCollisionA: Position = {
    x: startA.x + (endA.x - startA.x) * timeBeforeCollision,
    y: startA.y + (endA.y - startA.y) * timeBeforeCollision
  };
  
  const positionBeforeCollisionB: Position = {
    x: startB.x + (endB.x - startB.x) * timeBeforeCollision,
    y: startB.y + (endB.y - startB.y) * timeBeforeCollision
  };
  
  return {
    Starting_Position_A: startA,
    Starting_Position_B: startB,
    Theoretical_Ending_Position_A: endA,
    Theoretical_Ending_Position_B: endB,
    entityA,
    entityB,
    Position_Just_Before_Collision_A: positionBeforeCollisionA,
    Position_Just_Before_Collision_B: positionBeforeCollisionB,
    Last_Box_Just_Before_Collision_A: {
      x: positionBeforeCollisionA.x,
      y: positionBeforeCollisionA.y,
      width: entityA.width,
      height: entityA.height
    },
    Last_Box_Just_Before_Collision_B: {
      x: positionBeforeCollisionB.x,
      y: positionBeforeCollisionB.y,
      width: entityB.width,
      height: entityB.height
    }
  };
}

/**
 * Swept AABB collision detection - finds the time of collision between two moving AABBs
 * Returns the time (0-1) when collision occurs, or null if no collision
 */
function getSweptAABBCollisionTime(
  boxA: Box,
  velocityA: { x: number; y: number },
  boxB: Box,
  velocityB: { x: number; y: number }
): number | null {
  // Calculate relative velocity (A relative to B)
  const relativeVelocity = {
    x: velocityA.x - velocityB.x,
    y: velocityA.y - velocityB.y
  };
  
  // If there's no relative movement, check for static overlap
  if (relativeVelocity.x === 0 && relativeVelocity.y === 0) {
    return areBoxesOverlapping(boxA, boxB) ? 0 : null;
  }
  
  // Expand boxB by boxA's dimensions to treat boxA as a point
  const expandedBoxB = {
    x: boxB.x - boxA.width,
    y: boxB.y - boxA.height,
    width: boxB.width + boxA.width,
    height: boxB.height + boxA.height
  };
  
  // Perform ray-box intersection
  const tEntry = {
    x: relativeVelocity.x > 0 ? 
        (expandedBoxB.x - boxA.x) / relativeVelocity.x : 
        (expandedBoxB.x + expandedBoxB.width - boxA.x) / relativeVelocity.x,
    y: relativeVelocity.y > 0 ? 
        (expandedBoxB.y - boxA.y) / relativeVelocity.y : 
        (expandedBoxB.y + expandedBoxB.height - boxA.y) / relativeVelocity.y
  };
  
  const tExit = {
    x: relativeVelocity.x > 0 ? 
        (expandedBoxB.x + expandedBoxB.width - boxA.x) / relativeVelocity.x : 
        (expandedBoxB.x - boxA.x) / relativeVelocity.x,
    y: relativeVelocity.y > 0 ? 
        (expandedBoxB.y + expandedBoxB.height - boxA.y) / relativeVelocity.y : 
        (expandedBoxB.y - boxA.y) / relativeVelocity.y
  };
  
  // Handle division by zero (no movement in that axis)
  if (relativeVelocity.x === 0) {
    if (boxA.x >= expandedBoxB.x + expandedBoxB.width || boxA.x <= expandedBoxB.x) {
      return null; // No collision possible
    }
    tEntry.x = -Infinity;
    tExit.x = Infinity;
  }
  
  if (relativeVelocity.y === 0) {
    if (boxA.y >= expandedBoxB.y + expandedBoxB.height || boxA.y <= expandedBoxB.y) {
      return null; // No collision possible
    }
    tEntry.y = -Infinity;
    tExit.y = Infinity;
  }
  
  // Find the latest entry time and earliest exit time
  const tEntryMax = Math.max(tEntry.x, tEntry.y);
  const tExitMin = Math.min(tExit.x, tExit.y);
  
  // Check if collision occurs
  if (tEntryMax > tExitMin || tEntryMax < 0 || tEntryMax > 1) {
    return null;
  }
  
  return tEntryMax;
}

/**
 * Check if two axis-aligned bounding boxes are overlapping
 */
function areBoxesOverlapping(boxA: Box, boxB: Box): boolean {
  return !(
    boxA.x >= boxB.x + boxB.width ||
    boxA.x + boxA.width <= boxB.x ||
    boxA.y >= boxB.y + boxB.height ||
    boxA.y + boxA.height <= boxB.y
  );
}