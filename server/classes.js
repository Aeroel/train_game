class World {
    dimensions;
    objects = [];
    constructor() {
        this.dimensions = new WorldDimensions();

        this.dimensions.addDimension({
            name: "x",
            alternativeName: "width",
            movementOperations: {
                subtraction: "left",
                addition: "right",
            },
            size: 1000
        });
        this.dimensions.addDimension({
            name: "y",
            alternativeName: "height",
            movementOperations: {
                subtraction: "up",
                addition: "down",
            },
            size: 1000
        });

    }
    addObject(object) {
        this.objects.push(object);
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
    constructor({ worldDimensions }) {
        this.worldDimensions = worldDimensions;

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
    worldDimensions;
    constructor({worldDimensions, position, color, width, height }) {
        this.worldDimensions = worldDimensions;
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
    }
}

class AgentObject extends ObjectInWorld {
    move(direction) {
        const directionInfo = this.worldDimensions.getDirectionInfo(direction);
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
    socket;
    distancePerMove = 2;
    started;
    constructor({worldDimensions, position, width, height, visionRange, socket }) {
        super({ worldDimensions, position, width, height, color: "black" });
        this.visionRange = visionRange;
        this.socket = socket;
    }
}

class AIObject extends AgentObject {
    distancePerMove = 5;
    constructor({worldDimensions, position, width, height, color }) {
        super({worldDimensions, position, width, height, color });

    }

}

class StaticObject extends ObjectInWorld {
    constructor({worldDimensions, position, width, height, color }) {
        super({worldDimensions, position, width, height, color })
    }
}

export {
    World,
    WorldDimensions,
    ObjectPosition,
    ObjectInWorld,
    AgentObject,
    AIObject,
    PlayerObject,
    StaticObject,
}