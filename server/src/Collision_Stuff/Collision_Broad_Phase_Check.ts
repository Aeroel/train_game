import type { Position } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";

export class Collision_Broad_Phase_Check {
  private static readonly DEFAULT_MARGIN = 10; // Minimum margin in pixels
  private static readonly VELOCITY_MARGIN_MULTIPLIER = 1.5; // How much extra margin per velocity unit

  /**
   * Broad phase collision detection - checks if entities are close enough to warrant detailed collision checking
   * Uses cached next positions to avoid expensive recalculation in O(N²) scenarios
   * 
   * @param a First entity
   * @param b Second entity  
   * @param customMargin Optional custom margin override
   * @returns true if entities are close enough to check for collision
   */
  static areCloseEnoughForCollisionCheck(
    a: Base_Entity, 
    b: Base_Entity, 
  ): boolean {
    // Early exit for identical entities
    if (a === b) return false;

    // Use cached positions if available, otherwise calculate
    const nextA = a.calculateNextPositionBasedOnForcesAndDeltaTime();
    const nextB = b.calculateNextPositionBasedOnForcesAndDeltaTime();

    // Calculate dynamic margin based on velocities
    const margin = this.calculateDynamicMargin(a, b);

    // Check if bounding boxes (with margin) would overlap
    const horizontalClose = (nextA.x - margin) < (nextB.x + b.width + margin) &&
                           (nextA.x + a.width + margin) > (nextB.x - margin);

    const verticalClose = (nextA.y - margin) < (nextB.y + b.height + margin) &&
                         (nextA.y + a.height + margin) > (nextB.y - margin);

    return horizontalClose && verticalClose;
  }

  /**
   * Calculate dynamic margin based on entity velocities
   * Faster moving entities need larger margins to catch potential collisions
   */
  private static calculateDynamicMargin(a: Base_Entity, b: Base_Entity): number {
   const avx = a.vx.get();
   const avy = a.vy.get();
   const bvx = b.vx.get();
   const bvy = b.vy.get();
    const aSpeed = Math.sqrt((avx || 0) ** 2 + (avy || 0) ** 2);
    const bSpeed = Math.sqrt((bvx || 0) ** 2 + (bvy || 0) ** 2);
    const maxSpeed = Math.max(aSpeed, bSpeed);
    
    return this.DEFAULT_MARGIN + (maxSpeed * this.VELOCITY_MARGIN_MULTIPLIER);
  }

}