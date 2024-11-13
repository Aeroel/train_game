export { World }
class World {
    static state = {
      entities: new Array(),
    };
    static pastStates = [];
    static addEntity(entity) {
      World.state.entities.push(entity)
    }
    static getCurrentState() {
      return World.state;
    }
    static getCurrentEntities() {
      return World.state.entities;
    }
    
}