import type { Position } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";


/**
 * Broad-phase spatial filter:
 * Return true if entities' swept bounding boxes (current -> next) overlap,
 * meaning a finer-grained collision check may be necessary.
 */
export function Are_Entities_Close_Enough_To_Bother_Looking_For_A_Collision_Further(
  entityA: Base_Entity,
  entityB: Base_Entity
): boolean {
  
  if (!entityA || !entityB) return false;

  // Helper to safely get current values (prefer properties, fall back to getters)
  const getX = (e: Base_Entity) =>
    typeof e.x === "number" ? e.x : (typeof e.getX === "function" ? e.getX() : 0);
  const getY = (e: Base_Entity) =>
    typeof e.y === "number" ? e.y : (typeof e.getY === "function" ? e.getY() : 0);
  const getW = (e: Base_Entity) =>
    typeof e.width === "number" ? e.width : (typeof e.getWidth === "function" ? e.getWidth() : 0);
  const getH = (e: Base_Entity) =>
    typeof e.height === "number" ? e.height : (typeof e.getHeight === "function" ? e.getHeight() : 0);

  // Current boxes
  const aX = getX(entityA);
  const aY = getY(entityA);
  const aW = getW(entityA);
  const aH = getH(entityA);

  const bX = getX(entityB);
  const bY = getY(entityB);
  const bW = getW(entityB);
  const bH = getH(entityB);

  // Next positions (use the entity's movement prediction)
  let aNext: Position | undefined;
  let bNext: Position | undefined;
  try {
    aNext = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
  } catch {
    aNext = { x: aX, y: aY }; // fallback to current if calculation fails
  }
  try {
    bNext = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();
  } catch {
    bNext = { x: bX, y: bY };
  }

  const aNextX = typeof aNext?.x === "number" ? aNext.x : aX;
  const aNextY = typeof aNext?.y === "number" ? aNext.y : aY;
  const bNextX = typeof bNext?.x === "number" ? bNext.x : bX;
  const bNextY = typeof bNext?.y === "number" ? bNext.y : bY;

  // Swept boxes are union of current and next positions
  const aMinX = Math.min(aX, aNextX);
  const aMaxX = Math.max(aX + aW, aNextX + aW);
  const aMinY = Math.min(aY, aNextY);
  const aMaxY = Math.max(aY + aH, aNextY + aH);

  const bMinX = Math.min(bX, bNextX);
  const bMaxX = Math.max(bX + bW, bNextX + bW);
  const bMinY = Math.min(bY, bNextY);
  const bMaxY = Math.max(bY + bH, bNextY + bH);

  // Quick rejection: if swept boxes don't overlap on any axis, they can't collide
  const separatedX = aMaxX < bMinX || aMinX > bMaxX;
  const separatedY = aMaxY < bMinY || aMinY > bMaxY;

  return !(separatedX || separatedY);
}
