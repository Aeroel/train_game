import type { Base_Entity } from "#root/Entities/Base_Entity.js"


export { World }
class World {
  static width: number = 20_000;
  static height: number = 20_000;
  static state = {
    entities: new Array(),
  };
  static pastStates = [];  // to do save all past states? 
  static addEntity<T extends Base_Entity>(entity: T)  {
    if(!entity.hasTag('Entity')) {
      throw new Error('Entity has no entity tag, check stuff');

    }
    World.state.entities.push(entity);
    entity.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld:true});
          return entity;
  }

  
  static getCurrentState() {
    return World.state;
  }
  
  
  static getCurrentEntities() : Base_Entity[] {
    return World.getCurrentState().entities;
  }
  // aliases
  static getAllEntities() : Base_Entity[] {
    return World.getCurrentEntities();
  }
  static getEntities(): Base_Entity[] {
    return World.getAllEntities();
  }
  
  
  static filterEntities(filterCriteriaFunction: (entity: Base_Entity)=> boolean) : Base_Entity[] {
    return World.getCurrentEntities().filter(filterCriteriaFunction);
  }


}