import { Ground } from "#root/Entities/Ground.js";
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Position } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Wall } from "#root/Entities/Wall.js";
import { My_Assert } from "#root/My_Assertion_Functionality.js";

export { Add_Some_Entities_To_The_World };

class Add_Some_Entities_To_The_World {
    static carSquareSize = 150;
    static railLength = 1000;
    static rails: Rail[] = [];
    static Put_A_Train_On_Rail(rail: Rail) {
        if (!(rail instanceof Rail) || !(rail.hasTag("Rail"))) {
            throw new Error(`Expects object of Rail, but got ${JSON.stringify(rail)}`);
        }
        const train = new Train(rail, 4, Add_Some_Entities_To_The_World.carSquareSize);
        World.addEntity(train)


    }
    static doItNow() {

        Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();

        Add_Some_Entities_To_The_World.addTheGroundToTheWholeWorld();



        World.addEntity(new Forcefield());

        const first_rail = Add_Some_Entities_To_The_World.addARailway(400, 200);

        this.Put_A_Train_On_Rail(first_rail);


    }

    static addARailway(x: number, y: number) {
        const mainLength = 4000;

        // extension dirs
        const firstDir = "down";
        const secondDir = "right";
        const thirdDir = "down";

        // ends
        const secondEnd = "bottomEnd";
        const thirdEnd = "rightEnd";

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));

        // left track
        const rail1_0 = Railway_Placing_Functionality.place(x, y, mainLength, firstDir);
        const rail2_0 = Railway_Placing_Functionality.placeNextTo(rail1_0, secondEnd, secondDir, mainLength);
        const rail3_0 = Railway_Placing_Functionality.placeNextTo(rail2_0, thirdEnd, thirdDir, mainLength);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "bottomEnd", "left", 500);
        // right track
        const rail1_1 = Railway_Placing_Functionality.place(x + (this.carSquareSize * 2), y, offsetOfRight, firstDir);
        const rail2_1 = Railway_Placing_Functionality.placeNextTo(rail1_1, secondEnd, secondDir, mainLength);
        const rail3_1 = Railway_Placing_Functionality.placeNextTo(rail2_1, thirdEnd, thirdDir, mainLength + (2 * this.carSquareSize));

        // left connections
        rail1_0.connectWithRail(rail2_0, "bottomEnd",  "leftEnd",);
        rail2_0.connectWithRail(rail3_0, "rightEnd",  "topEnd",);
        rail3_0.connectWithRail(rail4_0,"bottomEnd", "rightEnd")

        // right connections
        rail1_1.connectWithRail(rail2_1, "bottomEnd",  "leftEnd",);
        rail2_1.connectWithRail(rail3_1, "rightEnd", "topEnd",);


        return rail1_0;

    }


    static addTheGroundToTheWholeWorld() {
        const ground = new Ground();
        ground.setX(0);
        ground.setY(0);
        ground.setWidth(World.width);
        ground.setHeight(World.height);
        World.addEntity(ground);
    }

    static addAWhiteRectangleForMovementReference() {
        const newEntity = new Base_Entity();
        newEntity.setX(0);
        newEntity.setY(0);
        newEntity.setWidth(50);
        newEntity.setHeight(40);
        World.addEntity(newEntity);
    }
}