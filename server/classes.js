class World {
    dimensions = new WorldDimensions();
    objects = [];

    addObject(object) {
        this.objects.push(object);
    }
}
class WorldDimensions {
    dimensions = [];
    addDimension({name, additionalName,  size}) {

        this.dimensions[name] = {additionalName, size};
    }
    getDimensionSize(name) {
        return this.dimensions[name].size;
    }

    getDimensionNames() {
        return Object.keys(this.dimensions);
    }
    getDimensions() {
        return this.dimensions;
    }
}

class ObjectPosition {
    coordinates = {};
    constructor({ dimensions }) {

        dimensions.forEach(dimension => {
            this.coordinates[dimension] = 0;
        });

    }
    setCoordinate({ name, value }) {
        if (this.coordinates.hasOwnProperty(name)) {
            this.coordinates[name] = value;
        } else {
            throw new Error(`Dimension ${name} not found in position`);
        }

    }
    getCoordinate({ name }) {
        return this.coordinates[name];
    }
    getCoordinates() {
        return this.coordinates;
    }
}

class ObjectMovement {
    world;
    constructor({world}) {
        this.world = world;
    }

    static move({ direction }) {
        const info = { axis: null, axisOperation: null };

        switch (direction) {
            case "up":
                info.axisOperation = "subtraction";
            case "down":
                info.axisOperation = "addition";

                info.axis = "y";
                break;

            case "left":
                info.axisOperation = "subtraction";
            case "right":
                info.axisOperation = "addition";

                info.axis = "x";
                break;

            default:
                throw new Error(`Invalid direction ${direction}`);
                break;
        }

        return info;
    }

}

class ObjectInWorld {
    position
    color;
    width;
    height;
    constructor({ position, color, width, height }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
    }
}

class AgentObject extends ObjectInWorld {
    move(direction) {
        const moveInfo = WorldMovement.move(direction);
        if (moveInfo.axisOperation === "addition") {
            this.position[moveInfo.axis] += this.distancePerMove;
        } else if (moveInfo.axisOperation === "subtraction") {
            this.position[moveInfo.axis] -= this.distancePerMove;
        }

        WorldPosition.ensurePositionIsWithinWorldBounds({ position: this.position });
    }

}

class Player extends AgentObject {
    visionRange;
    socket;
    distancePerMove = 2;
    started;
    constructor({ position, width, height, visionRange, socket }) {
        super({ position, width, height, color: "black" });
        this.visionRange = visionRange;
        this.socket = socket;
    }
}

class AI extends AgentObject {
    distancePerMove = 5;
    constructor({ position, width, height, color }) {
        super({ position, width, height, color });

    }

}

class StaticObject extends ObjectInWorld {
    constructor({ position, width, height, color }) {

    }
}

export {
    World, ObjectInWorld, Player, AI, World, WorldMovement, WorldPosition, AgentObject,
}