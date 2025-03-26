import { Ground } from "#root/Entities/Ground.js";
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";

export { Add_Some_Entities_To_The_World };

class Add_Some_Entities_To_The_World {
    static carSquareSize = 150;
    static railLength = 500;
    static rails = [];
    static doItNow() {
        Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();

        Add_Some_Entities_To_The_World.addTheGroundToTheWholeWorld();

        const theFirstRail = Add_Some_Entities_To_The_World.addASmallRailwayAndGetTheFirstRail();

        Add_Some_Entities_To_The_World.putATrainCarOnThisRail(theFirstRail);

        World.addEntity(new Forcefield());

        const stSS = new Station_Stop_Spot();
        stSS.setX(400);
        stSS.setY(500);
        stSS.setWidth(10);
        stSS.setHeight(20);
        World.addEntity(stSS);

        const stSS_2 = new Station_Stop_Spot();

        // this comment is for  commit test, remove later
        stSS_2.setX(400);
        stSS_2.setY(50);
        stSS_2.setWidth(10);
        stSS_2.setHeight(20);
        World.addEntity(stSS_2);

        // this.addAnotherCarAndAVerticalRailBelowIt();

        // const aCar = new Train_Car();
        // aCar.setFrontSide("firstEnd")
        // aCar.setCurrentRail(this.rails[0]);
        // aCar.setX(1000)
        // aCar.setY(1000)
        // aCar.setHeight(this.carW)
        // aCar.setWidth(this.carH);
        // World.addEntity(aCar)



    }
    static addAnotherCarAndAVerticalRailBelowIt() {
        const verRail = Railway_Placing_Functionality.place(500, 500, 400, "down");
        this.putATrainCarOnThisRail(verRail);
    }
    static putATrainCarOnThisRail(theRail) {


        // Calculate the train car's position (centered on the rail)
        const carX = theRail.getX() + (theRail.getWidth() - this.carSquareSize) / 2;
        const carY = theRail.getY() + (theRail.getHeight() - this.carSquareSize) / 2;

        const aTrainCar = new Train_Car({rail: theRail, size: this.carSquareSize, x: carX, y:carY});
        World.addEntity(aTrainCar);
        aTrainCar.setFrontSide("firstEnd");
        aTrainCar.setCurrentRail(theRail);
    }
    static addASmallRailwayAndGetTheFirstRail() {
        const rail1 = Railway_Placing_Functionality.place(10, 10, this.railLength, 'right'); // Top horizontal rail

        const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, 'rightEnd', 'down', this.railLength);
        rail2.connectWithRail("firstEnd", "secondEnd", rail1);

        // Right vertical rail
        const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, 'bottomEnd', 'left', this.railLength); // Bottom horizontal rail
        rail3.connectWithRail("secondEnd", "secondEnd", rail2);

        const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, 'leftEnd', 'up', this.railLength); // Left vertical rail
        rail4.connectWithRail("secondEnd", "firstEnd", rail3);
        rail4.connectWithRail("firstEnd", "firstEnd", rail1);

        this.rails.push(rail1, rail2, rail3, rail4);
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