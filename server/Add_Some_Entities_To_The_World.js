import { Ground } from "./Ground.js";
import { Entity } from "./Entity.js";
import { Railway_Placing_Functionality } from "./train_stuff/Railway_Placing_Functionality.js";
import { Train_Car } from "./train_stuff/Train_Car.js";
import { World } from "./World.js";
import { Forcefield } from "./Forcefield.js";
import { Rail } from "./train_stuff/Rail.js";

export { Add_Some_Entities_To_The_World }

class Add_Some_Entities_To_The_World {
    static doItNow() {
        Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();

        Add_Some_Entities_To_The_World.addTheGroundToTheWholeWorld();

        const theFirstRail = Add_Some_Entities_To_The_World.addASmallRailwayAndGetTheFirstRail();

        Add_Some_Entities_To_The_World.putATrainCarOnThisRail(theFirstRail);

        World.addEntity(new Forcefield())

        this.addAnotherCarAndAVerticalRailBelowIt();

        const aCar = new Train_Car()
        aCar.setX(1000)
        aCar.setY(1000)
        aCar.setHeight(175)
        aCar.setWidth(250);
        World.addEntity(aCar)



    }
    static addAnotherCarAndAVerticalRailBelowIt() {
        const verRail = Railway_Placing_Functionality.place(500,500,400,"down");
        this.putATrainCarOnThisRail(verRail);
    }
    static putATrainCarOnThisRail(theRail) {
        const aTrainCar = new Train_Car()
        World.addEntity(aTrainCar);
        aTrainCar.setWidth(175)
        aTrainCar.setHeight(250); 

        // Calculate the train car's position (centered on the rail)
        const carX = theRail.getX() + (theRail.getWidth() - aTrainCar.getWidth()) / 2;
        const carY = theRail.getY() + (theRail.getHeight() - aTrainCar.getHeight()) / 2;

        aTrainCar.setX(carX)
        aTrainCar.setY(carY)
    }
    static addASmallRailwayAndGetTheFirstRail() {
        const rail1 = Railway_Placing_Functionality.place(10, 10, 250, 'right'); // Top horizontal rail
        const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, 'rightEnd', 'down', 250); // Right vertical rail
        const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, 'bottomEnd', 'left', 250); // Bottom horizontal rail
        const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, 'leftEnd', 'down', 250); // Left vertical rail
        const rail5 = Railway_Placing_Functionality.placeNextTo(rail4, 'bottomEnd', 'right', 250); // 
        const rail6 = Railway_Placing_Functionality.placeNextTo(rail5, 'rightEnd', 'down', 250);
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
        const newEntity = new Entity();
        newEntity.setX(0);
        newEntity.setY(0);
        newEntity.setWidth(50);
        newEntity.setHeight(40);
        World.addEntity(newEntity);
    }
}