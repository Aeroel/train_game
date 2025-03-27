export { World };
class World {
    static width = 10_000;
    static height = 10_000;
    static state = {
        entities: new Array(),
    };
    static pastStates = [];
    static addEntity(entity) {
        if (!entity.hasTag('Entity')) {
            throw new Error('Entity has no entity tag, check stuff');
        }
        World.state.entities.push(entity);
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
}
