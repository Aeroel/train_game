
import {
  World
} from "./World.js"
export { PreEmitStuff }
class PreEmitStuff {
    static someArbitraryNumber = 2000;
  static anotherArbitraryNumber = 1000
  static virtualWidth = this.someArbitraryNumber;
 static virtualHeight = this.anotherArbitraryNumber;
  static getVisibleToPlayerEntitiesAndVirtualWidthAndVirtualHeightAndHideAllTheRealWorldXYCoordinatesByReturningVirtualOnesInstead(player) {
    const visibleEntities = PreEmitStuff.getVisibleEntities(player)
    const virtualizedEntities = PreEmitStuff.virtualizeXYToAvoidExposingRealWorldXY(visibleEntities, player, PreEmitStuff.virtualWidth, PreEmitStuff.virtualHeight);
    return {
      entities:
    virtualizedEntities,
      virtualHeight: this.virtualHeight,
      virtualWidth: this.virtualWidth,
    };
  }
  static getVisibleEntities(player) {
    const visibleEntities = new Array();
    World.getCurrentEntities().forEach(entity => {
      const visiblePortion = PreEmitStuff.getVisiblePortion(player, entity)
      if (!visiblePortion) {
        return;
      }
      visibleEntities.push({
        x: visiblePortion.x,
        y: visiblePortion.y,
        width: visiblePortion.width,
        height: visiblePortion.height,
        color: entity.color
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


        return {
            ...entity,
            x: virtualX,
            y: virtualY,
            width: entity.width * scaleX,
            height: entity.height * scaleY
        };
    });
}


  static getVisiblePortion (entityWhichIsLookingAround,
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
}