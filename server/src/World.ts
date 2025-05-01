import type { Base_Entity } from "#root/Entities/Base_Entity.js"

export { World }
class World {
  static width: number = 10_000;
  static height: number = 10_000;
  static state = {
    entities: new Array(),
  };
  static pastStates = [];  // to do save all past states? 
  static addEntity<T extends Base_Entity>(entity: T) : void {
    if(!entity.hasTag('Entity')) {
      throw new Error('Entity has no entity tag, check stuff');
      
    }
    World.state.entities.push(entity)
  }
  static getCurrentState() {
    return World.state;
  }
  static getCurrentEntities() : Base_Entity[] {
    return World.getCurrentState().entities;
  }
  static filterEntities(filterCriteriaFunction: (entity: Base_Entity)=> boolean) : Base_Entity[] {
    return World.getCurrentEntities().filter(filterCriteriaFunction);
  }


}