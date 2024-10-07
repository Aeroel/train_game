import { rando } from "@nastyox/rando.js";

class WorldsContainer {
    worlds = new Map();
    nextIdWillBe = 0;
    giveMeARandomWorldId() {
        const minWorldId = 0;
        const maxWorldId = this.nextIdWillBe - 1;
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
    width;
    height;
    objects = [];
    constructor({width, height}) {
        this.width = width;
        this.height = height;
    }
    getObjectsOfClass(className) {
        const objectsOfSpecifiedClass = this.objects.filter(object => object.constructor.name === className);
        return objectsOfSpecifiedClass;
    }
    addObject(theObject) {
        this.objects.push(theObject);
    }
    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }
}

class ObjectInWorld {
    x;
    y;
    color;
    width;
    height;
    constructor({ x, y, color, width, height }) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
    }
}

class AgentObject extends ObjectInWorld {
    visionRange;
    distancePerMove;
    constructor({ x, y, color, width, height, visionRange, distancePerMove }) {
        super({ x, y, color, width, height });
        this.visionRange = visionRange;
        this.distancePerMove = distancePerMove;
    }
    move(direction) {
        switch (direction) {
            case "left":
                this.x -= this.distancePerMove;
                break;
            case "right":
                this.x += this.distancePerMove;
                break;
            case "up":
                this.y -= this.distancePerMove;
                break;
            case "down":
                this.y += this.distancePerMove;
                break;
        }
    }

}

class PlayerObject extends AgentObject {
    socketId;
    distancePerMove = 2;
    started = false;
    constructor({ x, y, width, height, visionRange, socketId }) {
        super({ x, y, width, height, color: "purple", visionRange });
        this.socketId = socketId;
    }
}

class AIObject extends AgentObject {
    distancePerMove = 5;
    constructor({ x, y, width, height, visionRange, color }) {
        super({ x, y, width, height, color, visionRange });

    }

}

class StationaryObject extends ObjectInWorld {
    constructor({ position, width, height, color }) {
        super({ position, width, height, color })
    }
}

export {
    WorldsContainer,
    World,
    ObjectInWorld,
    AgentObject,
    AIObject,
    PlayerObject,
    StationaryObject,
}