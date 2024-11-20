class Rail {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.orientation = width > height ? 'horizontal' : 'vertical';
    }

    // Get the start and end positions based on orientation
    getFirstEnd() {
        if (this.orientation === 'horizontal') {
            return { x: this.x, y: this.y };
        } else {
            return { x: this.x, y: this.y };
        }
    }

    getSecondEnd() {
        if (this.orientation === 'horizontal') {
            return { x: this.x + this.width, y: this.y };
        } else {
            return { x: this.x, y: this.y + this.height };
        }
    }
}

// Place a rail at specific coordinates with a given direction
function place(x, y, length, direction) {
    let rail = new Rail(x, y, 0, 0); // Default empty rail
    switch (direction) {
        case 'right':
            rail.width = length;
            rail.height = 10; // Default rail height
            break;
        case 'left':
            rail.width = -length;
            rail.height = 10;
            rail.x = x - length; // Adjust x to account for leftward movement
            break;
        case 'up':
            rail.height = length;
            rail.width = 10; // Default rail width
            break;
        case 'down':
            rail.height = length;
            rail.width = 10;
            break;
    }
    World.addEntity(rail); // Add the rail to the world
    return rail;
}

// Place a rail next to an existing rail
function placeNextTo(rail, relative, direction, length) {
    let newX, newY;
    let firstEnd = rail.getFirstEnd();
    let secondEnd = rail.getSecondEnd();
    
    // Decide where to place the new rail based on relative and direction
    if (relative === 'firstEnd') {
        newX = firstEnd.x;
        newY = firstEnd.y;
    } else if (relative === 'secondEnd') {
        newX = secondEnd.x;
        newY = secondEnd.y;
    }

    let newRail = place(newX, newY, length, direction);
    return newRail;
}

// Example usage:
const rail1 = place(10, 10, 250, 'right'); // Horizontal rail going right
const rail2 = placeNextTo(rail1, 'secondEnd', 'down', 250); // Place rail below rail1
const rail3 = placeNextTo(rail2, 'secondEnd', 'left', 250); // Place rail left of rail2
const rail4 = placeNextTo(rail3, 'firstEnd', 'up', 250); // Place rail above rail3