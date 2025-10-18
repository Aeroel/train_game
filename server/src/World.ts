import type { Base_Entity } from "#root/Entities/Base_Entity.js"


export { World }
class World {
  static width: number = 60_000;
  static height: number = 60_000;
  static state = {
    entities: new Array<Base_Entity>(),
  };
  static pastStates = [];  // to do save all past states? 
  static addEntity<T extends Base_Entity>(entity: T)  {
    if(!entity.hasTag('Entity')) {
      throw new Error('Entity has no entity tag, check stuff');

    }
    if(World.state.entities.includes(entity)) {
      throw new Error("Tried to add entity to world but it already exists in the world")
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
  static removeEntity(entity: Base_Entity) {
    const index = World.getEntities().indexOf(entity);
    World.spliceEntity(index, 1);    
  }
  static spliceEntity(start: number, deleteCount?: number): Base_Entity[] {

    const arr = World.getEntities();
    

    const removedItems = arr.splice(start, deleteCount ?? (arr.length - start));
    
    
    return removedItems;
}

  
  
  static filterEntities(filterCriteriaFunction: (entity: Base_Entity)=> boolean) : Base_Entity[] {
    return World.getCurrentEntities().filter(filterCriteriaFunction);
  }


}