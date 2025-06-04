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
       const rail1 = Railway_Placing_Functionality.place(x, y, 1000, "down");

       const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, "bottomEnd", "right", 1000);
       rail2.connectWithRail("firstEnd", "bottomEnd", rail1)

       const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, "rightEnd", "down", 1000);
       rail3.connectWithRail("topEnd", "rightEnd", rail2);

       const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, "bottomEnd", "left", 300);
       rail4.connectWithRail("rightEnd", "bottomEnd", rail3);

       const rail5 = Railway_Placing_Functionality.placeNextTo(rail4, "firstEnd", "down", 300);
       rail5.connectWithRail("firstEnd", "firstEnd", rail4);

       const rail6 = Railway_Placing_Functionality.placeNextTo(rail5, "bottomEnd", "right", 500);
       rail6.connectWithRail("leftEnd", "bottomEnd", rail5);

       const rail7 = Railway_Placing_Functionality.placeNextTo(rail6, "rightEnd", "up", 1500);
       rail7.connectWithRail("bottomEnd", "rightEnd", rail6);

       const rail8  = Railway_Placing_Functionality.placeNextTo(rail7, "topEnd", "left", 1000);
       rail8.connectWithRail("rightEnd", "topEnd", rail7)

       const rail9 = Railway_Placing_Functionality.placeNextTo(rail8, "leftEnd", "up", 850);
       rail9.connectWithRail("bottomEnd", "firstEnd", rail8);

       const rail10 = Railway_Placing_Functionality.placeNextTo(rail9, "topEnd", "right", 300);
       rail10.connectWithRail("leftEnd", "topEnd", rail9);

       const rail11 = Railway_Placing_Functionality.placeNextTo(rail10, "rightEnd", "up", 300);
       rail11.connectWithRail("bottomEnd", "rightEnd", rail10);

       const rail12 = Railway_Placing_Functionality.placeNextTo(rail11, "topEnd", "left", 500);
       rail12.connectWithRail("rightEnd", "topEnd", rail11);

       const rail13 = Railway_Placing_Functionality.placeNextTo(rail12, "leftEnd", "down", 350);
       rail13.connectWithRail("bottomEnd", "topEnd", rail1);


        return rail1;

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