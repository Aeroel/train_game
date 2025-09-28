import { World } from "#root/World.js";
import type { Base_Entity } from "./Entities/Base_Entity.js";

 type Sort_Order = Record<string, number>;


export {
  EntitySorter
}
class EntitySorter {
  static readonly From_Top_Down_Camera_POV: Sort_Order = {
    "Planet": 0,
    "Rail_Switch_Wall": 0.5,
    "Rail": 1,
    "Train_Car": 2,
    "Player": 3,
    "Forcefield": 3,
    "Walls": 4,
    "Sliding_Door": 5, 
    "Sensor":6,
  };
  static Sort_Entities_In_Order_Of_Appearance_For_The_Top_Down_Camera(entities: Base_Entity[]) {
    this.entitySort(this.From_Top_Down_Camera_POV, entities);
  }
  static entitySort(sortOrder: Sort_Order, entities: Base_Entity[]) {

    return entities.sort((a, b) => {
      const tagA = this.getTagPriority(a, sortOrder);
      const tagB = this.getTagPriority(b, sortOrder);

      return tagA - tagB;
    });


  }

  static getTagPriority(entity: Base_Entity, sortOrder: Sort_Order) {
  // Find the highest-priority tag for this entity
  let tag: keyof Sort_Order;
  for (tag in sortOrder) {
    if (entity.hasTag(tag)) {
      return sortOrder[tag];
    }
  }
  // Default to the end if no recognized tag exists
  return Number.MAX_VALUE;
}

}