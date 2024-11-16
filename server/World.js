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
      return World.getCurrentState().entities;
    }
    static filterEntities(filterCriteriaFunction) {
      return World.getCurrentEntities().filter(filterCriteriaFunction);
    }
    static sortAllEntitiesInOrderOfAppearanceForTheTopDownCamera() {
      const allEntities = this.getCurrentEntities();
    // Sort entities to place ground entities at the bottom layer
    return allEntities.sort((a, b) => {
        const aHasGroundTag = a.tags?.includes('Ground');
        const bHasGroundTag = b.tags?.includes('Ground');

        // If both are ground or neither are ground, maintain their order
        if (aHasGroundTag === bHasGroundTag) {
            return 0;
        }

        // If 'a' is ground, it should come first
        if (aHasGroundTag) {
            return -1;
        }

        // If 'b' is ground, it should come first
        if (bHasGroundTag) {
            return 1;
        }

        // Default case (should never happen)
        return 0;
    });
    }
    
}