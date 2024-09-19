class World {
    constructor() {
        this.objects = []; // Array to hold all objects added to the world
    }

    add(object) {
        this.objects.push(object); // Add the object to the array
    }

    getAllOfSpecificClass(className) {
        return this.objects.filter(obj => obj.constructor.name === className); // Filter objects by class name
    }
}

// Example classes
class Player {
    hehe=2;
    // Player class implementation
}

class AI {
    // AI class implementation
}

// Example usage
const obj = new Player();
const ai = new AI();
const world = new World();
world.add(obj);
world.add(ai);
const allPlayers = world.getAllOfSpecificClass("Player");

console.log(allPlayers); // This will log an array of Player instance