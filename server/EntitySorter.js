import {
  World
} from "./World.js"

export {
  EntitySorter
}
class EntitySorter {
  static sortAllEntitiesInOrderOfAppearanceForTheTopDownCamera() {
    this.entitySort(World.getCurrentEntities())
  }
  static entitySort(entities) {
    const priority = {
      "Ground": 0,
      "Rail": 1,
      "Train_Car": 2,
      "Player": 3,
      "Forcefield": 3,
      "Walls": 4,
      "Sliding_Door": 4 // Same priority as Walls
    };

    return entities.sort((a, b) => {
      const tagA = this.getTagPriority(a, priority);
      const tagB = this.getTagPriority(b, priority);

      return tagA - tagB;
    });


  }

  static getTagPriority(entity, priority) {
  // Find the highest-priority tag for this entity
  for (let tag in priority) {
    if (entity.hasTag(tag)) {
      return priority[tag];
    }
  }
  // Default to the end if no recognized tag exists
  return Number.MAX_VALUE;
}

}