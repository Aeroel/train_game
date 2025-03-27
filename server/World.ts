import type { Base_Entity } from "#root/Entities/Base_Entity.js"

export { World }
class World {
  static width: number = 10_000;
  static height: number = 10_000;
  static state = {
    entities: new Array(),
  };
  static pastStates = [];
  static addEntity<T extends Base_Entity>(entity: T) : void {
    if(!entity.hasTag('Entity')) {
      throw new Error('Entity has no entity tag, check stuff');
      
    }
    World.state.entities.push(entity)
  }
  static getCurrentState() {
    return World.state;
  }
  static getCurrentEntities() {
    return World.getCurrentState().entities;
  }
  static filterEntities<T extends Base_Entity>(filterCriteriaFunction: (entity: T)=> boolean) : T[] {
    return World.getCurrentEntities().filter(filterCriteriaFunction);
  }


}