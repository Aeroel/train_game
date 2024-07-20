class DimensionManager {
    constructor() {
        this.dimensions = {};
    }

    addDimension({ name, alternativeName, movementOperations, size }) {
        this.dimensions[name] = { alternativeName, movementOperations, size };
    }

    getDirectionInfo(direction) {
        for (const [dimension, { movementOperations }] of Object.entries(this.dimensions)) {
            console.log(movementOperations);
            throw new Error("s");
            for (const [operation, dir] of Object.entries(movementOperations)) {
                if (dir === direction) {
                    return {
                        dimension,
                        dimensionOperation: operation
                    };
                }
            }
        }
        return null; // Return null if the direction is not found
    }
}

// Example usage
const manager = new DimensionManager();
manager.addDimension({
    name: "x",
    alternativeName: "width",
    movementOperations: {
        subtraction: "left",
        addition: "right",
    },
    size: 1000
});
manager.addDimension({
    name: "y",
    alternativeName: "height",
    movementOperations: {
        subtraction: "up",
        addition: "down",
    },
    size: 1000
});

console.log(manager.getDirectionInfo("left")); // { dimension: 'x', dimensionOperation: 'subtraction' }
console.log(manager.getDirectionInfo("down")); // { dimension: 'y', dimensionOperation: 'addition' }
console.log(manager.getDirectionInfo("right")); // { dimension: 'x', dimensionOperation: 'addition' }
console.log(manager.getDirectionInfo("up")); // { dimension: 'y', dimensionOperation: 'subtraction' }
