import type { Base_Entity } from "#root/Entities/Base_Entity.js"


export { World }
class World {
  static width: number = 50_000;
  static height: number = 50_000;
  static state = {
    entities: new Set<Base_Entity>(),
  };
  static pastStates = [];  // to do save all past states? 
  static addEntity<T extends Base_Entity>(entity: T)  {
    if(!entity.hasTag('Entity')) {
      throw new Error('Entity has no entity tag, check stuff');

    }
    World.state.entities.add(entity);
    entity.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld:true});
          return entity;
  }

  
  static getCurrentState() {
    return World.state;
  }
  
  
  static getCurrentEntities() : Base_Entity[] {
    return Array.from(World.getCurrentState().entities);
  }
  // aliases
  static getAllEntities() : Base_Entity[] {
    return World.getCurrentEntities();
  }
  static getEntities(): Base_Entity[] {
    return World.getAllEntities();
  }
  static removeEntity(start: number, deleteCount?: number): Base_Entity[] {

    const arr = World.getEntities();
    

    const removedItems = arr.splice(start, deleteCount ?? (arr.length - start));
    
    World.state.entities.clear();
    
    arr.forEach(item => World.state.entities.add(item));
    
    return removedItems;
}

  
  
  static filterEntities(filterCriteriaFunction: (entity: Base_Entity)=> boolean) : Base_Entity[] {
    return World.getCurrentEntities().filter(filterCriteriaFunction);
  }


}