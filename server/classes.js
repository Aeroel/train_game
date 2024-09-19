import { rando } from "@nastyox/rando.js";

class WorldsContainer {
    worlds = new Map();
    nextIdWillBe = 0;
    giveMeARandomWorldId() {
        const minWorldId = 0;
        const maxWorldId = this.nextIdWillBe;
        const randomWorldId = rando(minWorldId, maxWorldId);
        return randomWorldId;
    }
    giveMeARandomWorld() {
        const randomWorldId = this.giveMeARandomWorldId();
        const randomWorld = this.worlds.get(randomWorldId);
        return randomWorld;
    }
    addWorld(world) {
        this.worlds.set(this.nextIdWillBe, world);
        this.nextIdWillBe++;
    }
    getAllWorlds() {
        return this.worlds;
    }
    getWorldById(id) {
        return this.worlds.get(id);
    }
}
class World {
    dimensions;
    objects = [];
    constructor(dimensions) {
        this.dimensions = dimensions;
    }
    getObjectsOfClass(className) {
        const objectsOfSpecifiedClass = this.objects.filter(object => object.constructor.name === className);
        return objectsOfSpecifiedClass;
    }
    addObject({type, position, data}) {
        const positionObject = new ObjectPosition(this.dimensions);
        
    }
    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }
}
class WorldDimensions {
    dimensions = [];
    addDimension({ name, alternativeName, movementOperations, size }) {

        this.dimensions[name] = { alternativeName, movementOperations, size };
    }
    getDimensionSize(name) {
        return this.dimensions[name].size;
    }

    getDimensionNames() {
        return Object.keys(this.dimensions);
    }

    getDimensionsSizes() {
        const dimEntries = Object.entries(this.dimensions);
        return dimEntries.map(([name, { size }]) => ({ [name]: size }));
    }
    getAlternativeNamesSizes() {
        const dimValues = Object.values(this.dimensions);
        return dimValues.map(({ alternativeName, size }) => ({ [alternativeName]: size }));
    }
    getDirectionInfo(direction) {
        for (const [dimension, { movementOperations }] of Object.entries(this.dimensions)) {
            console.log(movementOperations);
            for (const [operation, dir] of Object.entries(movementOperations)) {
                if (dir === direction) {
                    return {
                        dimension,
                        dimensionOperation: operation
                    };
                }
            }
        }
        return null;
    }
}

class ObjectPosition {
    coordinates = {};
    worldDimensions;
    constructor(worldDimensions ) {
        this.worldDimensions = worldDimensions;

        this.initializeCoordinates();        
    }
    initializeCoordinates() {
        const dimensions = this.worldDimensions.getDimensionNames();
        dimensions.forEach(dimension => {
            this.coordinates[dimension] = 0;
        });
    }
    setCoordinate({ name, value }) {
        this.coordinates[name] = value;
    }
    getCoordinate({ name }) {
        return this.coordinates[name];
    }
    getCoordinates() {
        return this.coordinates;
    }
    ensurePositionIsWithinWorldBounds() {
        for (let coordName in this.coordinates) {
            if (!this.coordinates.hasOwnProperty(coordName)) {
                return;
            }
            const coordValue = this.coordinates[coordName];
            const dimensionLimit = this.worldDimensions.getDimensionSize(coordName);
            if (coordValue > dimensionLimit) {
                this.coordinates[coordName] = dimensionLimit;
            }
        }
    }
}

class ObjectInWorld {
    position
    color;
    width;
    height;
    constructor({position, color, width, height }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
    }
}

class AgentObject extends ObjectInWorld {
    move(direction) {
        const directionInfo = this.position.worldDimensions.getDirectionInfo(direction);
        if (directionInfo.dimensionOperation === "addition") {
            this.position[directionInfo.dimension] += this.distancePerMove;
        } else if (directionInfo.dimensionOperation === "subtraction") {
            this.position[directionInfo.dimension] -= this.distancePerMove;
        }

        this.position.ensurePositionIsWithinWorldBounds();
    }

}

class PlayerObject extends AgentObject {
    visionRange;
    socketId;
    distancePerMove = 2;
    started;
    constructor({position, width, height, visionRange, socketId }) {
        super({ position, width, height, color: "black" });
        this.visionRange = visionRange;
        this.socketId = socketId;
    }
}

class AIObject extends AgentObject {
    distancePerMove = 5;
    constructor({ position, width, height, color }) {
        super({ position, width, height, color });

    }

}

class StaticObject extends ObjectInWorld {
    constructor({ position, width, height, color }) {
        super({ position, width, height, color })
    }
}

export {
    WorldsContainer,
    World,
    WorldDimensions,
    ObjectPosition,
    ObjectInWorld,
    AgentObject,
    AIObject,
    PlayerObject,
    StaticObject,
}