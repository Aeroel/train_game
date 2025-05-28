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
import { Wall } from "./Wall.js";

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

        const theFirstRail = Add_Some_Entities_To_The_World.addARailway();
        Add_Some_Entities_To_The_World.Put_A_Train_On_Rail(theFirstRail);

        // Add_Some_Entities_To_The_World.putATrainCarOnThisRail(theFirstRail);

        World.addEntity(new Forcefield());

        // const stSS = new Station_Stop_Spot();
        // stSS.setX(400);
        // stSS.setY(500);
        // stSS.setWidth(10);
        // stSS.setHeight(20);
        // World.addEntity(stSS);

        // const stSS_2 = new Station_Stop_Spot();

        // // this comment is for  commit test, remove later
        // stSS_2.setX(400);
        // stSS_2.setY(50);
        // stSS_2.setWidth(10);
        // stSS_2.setHeight(20);
        // World.addEntity(stSS_2);
        const a_wall = new Wall();
        a_wall.setX(400);
        a_wall.setY(50);
        a_wall.setWidth(10);
        a_wall.setHeight(20);
        World.addEntity(a_wall);



    }
    static addRailFences() {

    }

    static topRails() {
        const rail1 = Railway_Placing_Functionality.place(270, 270, this.railLength, 'right'); // Top horizontal rail

        const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, 'rightEnd', 'right', this.railLength);
        rail2.connectWithRail("firstEnd", "secondEnd", rail1);
        return {rail1, rail2};
    }
    static rightRails(rail2: Rail) {
         // Right vertical rail
         const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, 'rightEnd', 'down', this.railLength); // Bottom horizontal rail
         rail3.connectWithRail("firstEnd", "secondEnd", rail2);

         const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, 'bottomEnd', 'down', this.railLength); // Bottom horizontal rail
         rail4.connectWithRail("firstEnd", "secondEnd", rail3);

         return rail4;
    }
    static bottomRails(rail4: Rail) {
        const rail5 = Railway_Placing_Functionality.placeNextTo(rail4, 'bottomEnd', 'left', this.railLength); // Bottom horizontal rail
        rail5.connectWithRail("secondEnd", "secondEnd", rail4);

        const rail6 = Railway_Placing_Functionality.placeNextTo(rail5, 'firstEnd', 'left', this.railLength); // Bottom horizontal rail
        rail6.connectWithRail("secondEnd", "firstEnd", rail5);

        

        return rail6;
    }
    static leftRails(rail6: Rail) {
        const rail7 = Railway_Placing_Functionality.placeNextTo(rail6, 'firstEnd', 'up', this.railLength); // Bottom horizontal rail
        rail7.connectWithRail("secondEnd", "firstEnd", rail6);

        const rail8 = Railway_Placing_Functionality.placeNextTo(rail7, 'firstEnd', 'up', this.railLength); // Bottom horizontal rail
        rail8.connectWithRail("secondEnd", "firstEnd", rail7);

        return rail8;
    }
    static addARailway() {
        const {rail1, rail2 } =  this.topRails();

       const rail4 = this.rightRails(rail2);

       const rail6 = this.bottomRails(rail4);

       const rail8 = this.leftRails(rail6);

       rail8.connectWithRail("firstEnd", "firstEnd", rail1);

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