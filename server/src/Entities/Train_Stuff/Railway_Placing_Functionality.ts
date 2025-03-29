import { World } from "#root/World.js";
import { Rail, type Rail_End_Name_Alternative } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction } from "#root/Type_Stuff.js";

export { Railway_Placing_Functionality }

class Railway_Placing_Functionality {
    static place(x: number, y: number, length: number, direction: Direction) {
        let rail = new Rail(); // Default empty rail
        rail.setX(x)
        rail.setY(y);
        
        switch (direction) {
            case 'right':
                rail.setWidth(length);
                rail.setHeight(10); // Default rail height (horizontal)
                break;
            case 'left':
                rail.setWidth(length);
                rail.setHeight(10); // Default rail height (horizontal)
                rail.x = rail.x - length; // Adjust x to account for leftward movement
                break;
            case 'up':
                rail.setHeight(length);
                rail.setWidth(10); // Default rail width (vertical)
                rail.y = rail.y - length;
                break;
            case 'down':
                rail.setHeight(length);
                rail.setWidth(10); // Default rail width (vertical)
                break;
        }
        World.addEntity(rail); // Add the rail to the world
        return rail;
    }
    
    // Place a rail next to an existing rail
    static placeNextTo(rail: Rail, relativeEnd: Rail_End_Name_Alternative, direction: Direction, length: number) {
        let newX;
        let newY;
        let end = rail.getEnd(relativeEnd); // Get position of the specified end
        
        // Decide where to place the new rail based on relativeEnd and direction
        newX = end.x;
        newY = end.y;
        // if(direction === 'left') {
        //     newX -= length; 
        // }
        // if(direction === 'up') {
        //     newY -= length; 
        // }
        if(relativeEnd === 'bottomEnd' && direction === 'left') {
            newX += 10;
            length += 10;
        }
        
        // Now place the next rail based on direction
        let newRail = this.place(newX, newY, length, direction);

        return newRail;
    }
}