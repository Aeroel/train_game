import { World } from "#root/World.js";
import type { Base_Entity } from "./Entities/Base_Entity.js";

export {
  EntitySorter
}
class EntitySorter {
  static readonly sortOrder = {
    "Ground": 0,
    "Rail": 1,
    "Train_Car": 2,
    "Player": 3,
    "Forcefield": 3,
    "Walls": 4,
    "Sliding_Door": 5, 
    "Sensor":6,
  };
  static Sort_All_Entities_In_Order_Of_Appearance_For_The_Top_Down_Camera() {
    this.entitySort(World.getCurrentEntities())
  }
  static entitySort(entities: Base_Entity[]) {

    return entities.sort((a, b) => {
      const tagA = this.getTagPriority(a, EntitySorter.sortOrder);
      const tagB = this.getTagPriority(b, EntitySorter.sortOrder);

      return tagA - tagB;
    });


  }

  static getTagPriority(entity: Base_Entity, sortOrder: typeof EntitySorter["sortOrder"]) {
  // Find the highest-priority tag for this entity
  let tag: keyof typeof EntitySorter["sortOrder"];
  for (tag in sortOrder) {
    if (entity.hasTag(tag)) {
      return sortOrder[tag];
    }
  }
  // Default to the end if no recognized tag exists
  return Number.MAX_VALUE;
}

}