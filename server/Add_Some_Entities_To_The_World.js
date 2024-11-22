import { Ground } from "./Ground.js";
import { Movable_Entity } from "./Movable_Entity.js";
import { Railway_Placing_Functionality } from "./train_stuff/Railway_Placing_Functionality.js";
import { World } from "./World.js";

export { Add_Some_Entities_To_The_World }

class Add_Some_Entities_To_The_World {
    static doItNow() {
        const newEntity = new Movable_Entity();
        newEntity.setX(0);
        newEntity.setY(0);
        newEntity.setWidth(50);
        newEntity.setHeight(40);
        World.addEntity(newEntity);

        const ground = new Ground();
        ground.setX(0);
        ground.setY(0);
        ground.setWidth(10000);
        ground.setHeight(10000);
        World.addEntity(ground);

        const rail1 = Railway_Placing_Functionality.place(10, 10, 250, 'right'); // Top horizontal rail
        const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, 'rightEnd', 'down', 250); // Right vertical rail
        const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, 'bottomEnd', 'left', 250); // Bottom horizontal rail
        const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, 'leftEnd', 'down', 250); // Left vertical rail
        const rail5 = Railway_Placing_Functionality.placeNextTo(rail4, 'bottomEnd', 'right', 250); // 
        const rail6 = Railway_Placing_Functionality.placeNextTo(rail5, 'rightEnd', 'down', 250); 
    }
}