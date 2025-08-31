import type { Position } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";


  
  /* Purpose: Test in simplest way to see if entities can possibly collide on their movement paths (including no movement)
   Logic: Just make an expanded box from each entity from its current xy up to its endingxy (endingxy is determimed by vxvy times timestep). this will create a box. The box will expand from startxy to endxy. if entity is still, the box is same size as entity. if entity moving, the expanded box is bigger than the entity. 
     Do this for both entities and then check if the expanded boxes overlap. if they dont return false. if they do, this means they might collide so we return true.
    this should work fine for small velocities and for straight line movement and is certainly a good starting point. note though that if some entity is moving very fast diagonally, its expanded box will be very big so this will trigger further collision checking for a lot of entities even if they never would have been close on the entity's actual diagonal linear trajectory. I mean, that is fine for now. there is no reason not to do this expansion, and maybe there are more precise checks I can introduce later that will be both cheaper than running full collision detection and yet actually take the entities' diagonal motions into account without making large expanded axis aligned rectangles but maybe somehow making a diagonal rectangle that more closely traces the entities move if diagonal
  */
export function Expand_entities_by_their_velocities_and_check_whether_they_might_collide(
    a: Base_Entity, 
    b: Base_Entity, 
  ): boolean {
    // Early exit in case they are identical
    if (a === b) return false;
    
    // Work with proxy objects instead of full entity objects
    const boxA = Collision_Stuff.entityToBoxWithVelocity(a);
    const boxB = Collision_Stuff.entityToBoxWithVelocity(b);
    
    // endxy
    const nextA = a.calculateNextPositionBasedOnVelocityAndDeltaTime();
    const nextB = b.calculateNextPositionBasedOnVelocityAndDeltaTime();
    
    let areThey = false;
    
    // Create expanded bounding boxes that cover the entity's movement path
    // BoxA expanded 
    const boxA_left = Math.min(boxA.x, nextA.x);
    const boxA_right = Math.max(boxA.x + boxA.width, nextA.x + boxA.width);
    const boxA_top = Math.min(boxA.y, nextA.y);
    const boxA_bottom = Math.max(boxA.y + boxA.height, nextA.y + boxA.height);
    
    // BoxB expanded
    const boxB_left = Math.min(boxB.x, nextB.x);
    const boxB_right = Math.max(boxB.x + boxB.width, nextB.x + boxB.width);
    const boxB_top = Math.min(boxB.y, nextB.y);
    const boxB_bottom = Math.max(boxB.y + boxB.height, nextB.y + boxB.height);
    
    // Check for AABB overlap of the expanded boxes on both axes
    const xOverlap = boxA_left <= boxB_right && boxA_right >= boxB_left;
    const yOverlap = boxA_top < boxB_bottom && boxA_bottom >= boxB_top;
    
    areThey = xOverlap && yOverlap;

    return areThey;
}
