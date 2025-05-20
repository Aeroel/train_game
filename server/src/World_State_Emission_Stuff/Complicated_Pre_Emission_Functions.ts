import {PreEmitStuff} from "#root/World_State_Emission_Stuff/PreEmitStuff.js";
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import {type VisibleEdge,
type VisibleEntity,
type VirtualizedEntity,
type CleanedEntity } from "#root/Type_Stuff.js";


export {Complicated_Pre_Emission_Functions}

class Complicated_Pre_Emission_Functions {
  static virtualizeXYToAvoidExposingRealWorldXY(visibleEntities: VisibleEntity[], POVEntity: Base_Entity, virtW: typeof PreEmitStuff["virtualWidth"], virtH: typeof PreEmitStuff["virtualHeight"]) : VirtualizedEntity[] {
    // Calculate the center of the player
    const centerX = virtW / 2;
    const centerY = virtH / 2;

    // Calculate the scale factors for virtual canvas based on max vision range dimensions
    const scaleX = virtW / POVEntity.visionRange;
    const scaleY = virtH / POVEntity.visionRange;

   /* code made using GPT below, I do not fully grasp it, though it does not seem to be complicated either 
   
   */
    // Adjust positions so the player is at the center and entities are scaled accordingly
    return visibleEntities.map(entity => {
      // Use player center (instead of top-left) to calculate relative positions
      const playerCenterX = POVEntity.x + POVEntity.width / 2;
      const playerCenterY = POVEntity.y + POVEntity.height / 2;

      const relX = entity.x - playerCenterX;  // Relative X position from the player's center
      const relY = entity.y - playerCenterY;  // Relative Y position from the player's center

      // Apply scaling and center adjustments
      const virtualX = centerX + (relX * scaleX);
      const virtualY = centerY + (relY * scaleY);

      const virtualizedEdges = Complicated_Pre_Emission_Functions.virtualizeEntityEdges(entity, POVEntity, virtW, virtH)

      return {
        ...entity,
        edges: virtualizedEdges,
        x: virtualX,
        y: virtualY,
        width: entity.width * scaleX,
        height: entity.height * scaleY
      };
    });
  }
    static virtualizeEntityEdges(entity: VisibleEntity, lookingEntity: Base_Entity, virtW: typeof PreEmitStuff["virtualWidth"], virtH: typeof PreEmitStuff["virtualHeight"]) {
    const scaleX = virtW / lookingEntity.visionRange;
    const scaleY = virtH / lookingEntity.visionRange;

    // Use center (instead of top-left) to calculate relative positions
    const lookingEntityCenterX = lookingEntity.x + lookingEntity.width / 2;
    const lookingEntityCenterY = lookingEntity.y + lookingEntity.height / 2;

    // Apply scaling and center adjustments to each edge

    const virtualEdges = entity.edges.map(edge => {
      const virtualX1 = virtW / 2 + (edge.x1 - lookingEntityCenterX) * scaleX;
      const virtualY1 = virtH / 2 + (edge.y1 - lookingEntityCenterY) * scaleY;
      const virtualX2 = virtW / 2 + (edge.x2 - lookingEntityCenterX) * scaleX;
      const virtualY2 = virtH / 2 + (edge.y2 - lookingEntityCenterY) * scaleY;

      return {
        x1: virtualX1,
        y1: virtualY1,
        x2: virtualX2,
        y2: virtualY2
      };
    });

    return virtualEdges;

  }

  static getVisiblePortion(entityWhichIsLookingAround: Base_Entity,
    possiblyVisibleEntity: Base_Entity) {
    // Calculate the player's vision area based on visionRange and centered position
    const visionCenterX = entityWhichIsLookingAround.x + entityWhichIsLookingAround.width / 2;
    const visionCenterY = entityWhichIsLookingAround.y + entityWhichIsLookingAround.height / 2;
    const visionArea = {
      x: visionCenterX - entityWhichIsLookingAround.visionRange / 2,
      y: visionCenterY - entityWhichIsLookingAround.visionRange / 2,
      width: entityWhichIsLookingAround.visionRange,
      height: entityWhichIsLookingAround.visionRange
    };


    // Calculate the intersection area between visionArea and entity
    const visibleX = Math.max(visionArea.x,
      possiblyVisibleEntity.x);
    const visibleY = Math.max(visionArea.y,
      possiblyVisibleEntity.y);
    const visibleWidth = Math.min(visionArea.x + visionArea.width,
      possiblyVisibleEntity.x + possiblyVisibleEntity.width) - visibleX;
    const visibleHeight = Math.min(visionArea.y + visionArea.height,
      possiblyVisibleEntity.y + possiblyVisibleEntity.height) - visibleY;

    // If there's no overlap, return null
    if (visibleWidth <= 0 || visibleHeight <= 0) return null;

    // Return the visible portion of the entity
    return {
      x: visibleX,
      y: visibleY,
      width: visibleWidth,
      height: visibleHeight,
    };
  };
  
  static getVisibleEdges(entityWhichIsLookingAround: Base_Entity,
    possiblyVisibleEntity: Base_Entity) : VisibleEdge[] {
    // Calculate the player's vision area based on visionRange and centered position
    const visionCenterX = entityWhichIsLookingAround.x + entityWhichIsLookingAround.width / 2;
    const visionCenterY = entityWhichIsLookingAround.y + entityWhichIsLookingAround.height / 2;
    const visionArea = {
      x: visionCenterX - entityWhichIsLookingAround.visionRange / 2,
      y: visionCenterY - entityWhichIsLookingAround.visionRange / 2,
      width: entityWhichIsLookingAround.visionRange,
      height: entityWhichIsLookingAround.visionRange
    };
    const edges = [];

    // Top edge
    if (possiblyVisibleEntity.y >= visionArea.y && possiblyVisibleEntity.y <= visionArea.y + visionArea.height) {
      edges.push({
        x1: Math.max(visionArea.x, possiblyVisibleEntity.x),
        y1: possiblyVisibleEntity.y,
        x2: Math.min(visionArea.x + visionArea.width, possiblyVisibleEntity.x + possiblyVisibleEntity.width),
        y2: possiblyVisibleEntity.y
      });
    }

    // Bottom edge
    if (possiblyVisibleEntity.y + possiblyVisibleEntity.height >= visionArea.y && possiblyVisibleEntity.y + possiblyVisibleEntity.height <= visionArea.y + visionArea.height) {
      edges.push({
        x1: Math.max(visionArea.x, possiblyVisibleEntity.x),
        y1: possiblyVisibleEntity.y + possiblyVisibleEntity.height,
        x2: Math.min(visionArea.x + visionArea.width, possiblyVisibleEntity.x + possiblyVisibleEntity.width),
        y2: possiblyVisibleEntity.y + possiblyVisibleEntity.height
      });
    }

    // Left edge
    if (possiblyVisibleEntity.x >= visionArea.x && possiblyVisibleEntity.x <= visionArea.x + visionArea.width) {
      edges.push({
        x1: possiblyVisibleEntity.x,
        y1: Math.max(visionArea.y, possiblyVisibleEntity.y),
        x2: possiblyVisibleEntity.x,
        y2: Math.min(visionArea.y + visionArea.height, possiblyVisibleEntity.y + possiblyVisibleEntity.height)
      });
    }

    // Right edge
    if (possiblyVisibleEntity.x + possiblyVisibleEntity.width >= visionArea.x && possiblyVisibleEntity.x + possiblyVisibleEntity.width <= visionArea.x + visionArea.width) {
      edges.push({
        x1: possiblyVisibleEntity.x + possiblyVisibleEntity.width,
        y1: Math.max(visionArea.y, possiblyVisibleEntity.y),
        x2: possiblyVisibleEntity.x + possiblyVisibleEntity.width,
        y2: Math.min(visionArea.y + visionArea.height, possiblyVisibleEntity.y + possiblyVisibleEntity.height)
      });
    }
    return edges;
  }

}