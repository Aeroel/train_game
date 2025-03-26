import { World } from "#root/World.js";


export { PreEmitStuff }

class PreEmitStuff {
  static someArbitraryNumber = 5000;
  static anotherArbitraryNumber = 5000
  static virtualWidth = this.someArbitraryNumber;
  static virtualHeight = this.anotherArbitraryNumber;

  static get_visible_to_player_entities_and_virtual_width_and_virtual_height_and_hide_all_the_real_world_xy_coordinates_by_returning_virtual_ones_instead(player) {
    const visibleEntities = this.getVisibleEntities(player)
    const virtualizedEntities = this.virtualizeXYToAvoidExposingRealWorldXY(visibleEntities, player, PreEmitStuff.virtualWidth, PreEmitStuff.virtualHeight);
    const entitiesWithOnlyProperties = this.onlyIncludeEntityPropertiesThatClientNeeds(virtualizedEntities);
    return {
      entities:
        entitiesWithOnlyProperties,
      virtualHeight: this.virtualHeight,
      virtualWidth: this.virtualWidth,
    };
  }
  static onlyIncludeEntityPropertiesThatClientNeeds(entities) {
    const cleanedEntities = [];
    entities.forEach(entity => {
      const tagsIAmFineWithExposing = ["Forcefield"];
      const cleanedTags = [];
      tagsIAmFineWithExposing.forEach(tagIAmFineWithExposing => {
        if(entity.tags.includes(tagIAmFineWithExposing)) {
          cleanedTags.push(tagIAmFineWithExposing);
        } 
      })
      cleanedEntities.push({
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
        color: entity.color,
        edges: entity.edges,
        tags: cleanedTags,

      })
    })
    return cleanedEntities;
  }
  static getVisibleEntities(player) {
    const visibleEntities = new Array();
    World.getCurrentEntities().forEach(entity => {
      const visiblePortion = PreEmitStuff.getVisiblePortion(player, entity);
      const visibleEdges = PreEmitStuff.getVisibleEdges(player, entity)
      if (!visiblePortion) {
        return;
      }

      visibleEntities.push({
        ...entity,
        x: visiblePortion.x,
        y: visiblePortion.y,
        width: visiblePortion.width,
        height: visiblePortion.height,
        edges: visibleEdges,
      })
    });
    return visibleEntities;
  }
  static virtualizeXYToAvoidExposingRealWorldXY(visibleEntities, player, virtW, virtH) {
    // Calculate the center of the player
    const centerX = virtW / 2;
    const centerY = virtH / 2;

    // Calculate the scale factors for virtual canvas based on max vision range dimensions
    const scaleX = virtW / player.visionRange;
    const scaleY = virtH / player.visionRange;


    // Adjust positions so the player is at the center and entities are scaled accordingly
    return visibleEntities.map(entity => {
      // Use player center (instead of top-left) to calculate relative positions
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;

      const relX = entity.x - playerCenterX;  // Relative X position from the player's center
      const relY = entity.y - playerCenterY;  // Relative Y position from the player's center

      // Apply scaling and center adjustments
      const virtualX = centerX + (relX * scaleX);
      const virtualY = centerY + (relY * scaleY);

      const virtualizedEdges = PreEmitStuff.virtualizeEntityEdges(entity, player, virtW, virtH)

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

  static virtualizeEntityEdges(entity, player, virtW, virtH) {
    const scaleX = virtW / player.visionRange;
    const scaleY = virtH / player.visionRange;

    // Use player center (instead of top-left) to calculate relative positions
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    // Apply scaling and center adjustments to each edge

    const virtualEdges = entity.edges.map(edge => {
      const virtualX1 = virtW / 2 + (edge.x1 - playerCenterX) * scaleX;
      const virtualY1 = virtH / 2 + (edge.y1 - playerCenterY) * scaleY;
      const virtualX2 = virtW / 2 + (edge.x2 - playerCenterX) * scaleX;
      const virtualY2 = virtH / 2 + (edge.y2 - playerCenterY) * scaleY;

      return {
        x1: virtualX1,
        y1: virtualY1,
        x2: virtualX2,
        y2: virtualY2
      };
    });

    return virtualEdges;
      
  }



  static getVisiblePortion(entityWhichIsLookingAround,
    possiblyVisibleEntity) {
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

  static getVisibleEdges(entityWhichIsLookingAround,
    possiblyVisibleEntity) {
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