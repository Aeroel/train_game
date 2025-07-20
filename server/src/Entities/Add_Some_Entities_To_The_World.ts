import { Ground } from "#root/Entities/Ground.js";
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Position } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Wall } from "#root/Entities/Wall.js";
import { My_Assert } from "#root/My_Assertion_Functionality.js";
import { Rail_Switch_Wall} from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"

export { Add_Some_Entities_To_The_World };

function AreOpposite(a: Direction, b:Direction) {
    return (
        (a === 'left' && b==='right') 
        || (a==='right' &&b ==='left')
        || (a==='down' && b==='up')
        ||  (a === 'up' && b==='down') 
    )
}
class Add_Some_Entities_To_The_World {
    static carSquareSize = 150;
    static railLength = 1000;
    static rails: Rail[] = [];
   
    static Put_A_Train_On_Rail(rail: Rail, forwards: Direction, backwards: Direction, movementDirection: "forwards" | "backwards") {
        if(!AreOpposite(forwards, backwards)) {
            throw new Error(`Directions must be opposing (left and right or up and down), but ${forwards} and ${backwards} given`);
        }
        if (!(rail instanceof Rail) || !(rail.hasTag("Rail"))) {
            throw new Error(`Expects object of Rail, but got ${JSON.stringify(rail)}`);
        }
        const train = new Train(rail, forwards, backwards, movementDirection, 4, Add_Some_Entities_To_The_World.carSquareSize);
        World.addEntity(train)


    }
    static doItNow() {

        Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();

        Add_Some_Entities_To_The_World.addTheGroundToTheWholeWorld();



        World.addEntity(new Forcefield());

        const first_rail = Add_Some_Entities_To_The_World.addARailway(400, 200);

        this.Put_A_Train_On_Rail(first_rail, "down", "up", "forwards");


    }

    static addARailway(x: number, y: number) {
        
        const mainLength = 4000;

        // extension dirs
        const firstDir = "down";
        const secondDir = "down";
        const thirdDir = "down";

        // ends
        const secondEnd = "bottomEnd";
        const thirdEnd = "rightEnd";

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));
        const switchLength = 400;


        // left track
        const rail1_0 = Railway_Placing_Functionality.place(x, y, mainLength, firstDir);
        const rail2_0 = Railway_Placing_Functionality.placeNextTo(rail1_0, secondEnd, secondDir, mainLength);
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "secondEnd", "right", switchLength, mainLength);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "rightEnd", "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "secondEnd", "up", switchLength, mainLength )



const carSquareSize = Add_Some_Entities_To_The_World.carSquareSize;
const thicknessWall = 10;
const lengthWall = 150;
const offset = carSquareSize * 2;
        const rail2BotEnd = rail2_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(rail2BotEnd))
        const wall = new Rail_Switch_Wall(rail2BotEnd.x , 
        rail2BotEnd.y + (carSquareSize / 2)
        , ["down"], ["down", "right"], lengthWall, thicknessWall);
        World.addEntity(wall);
        
        const rail3LeftEnd = rail3_0.getEnd("firstEnd");
        console.log("is " + JSON.stringify(rail3LeftEnd))
        const wall2 = new Rail_Switch_Wall(wall.x + offset, wall.y + offset, ["down", "right"], ["right"], thicknessWall, lengthWall);
        World.addEntity(wall2);
        
        
       const three = rail4_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(three))
        const wall3 = new Rail_Switch_Wall(three.x +(carSquareSize/2), three.y, ["right"], ["right", "up"], thicknessWall, lengthWall);
        World.addEntity(wall3);
        
       const four = rail5_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(four))
        const wall4 = new Rail_Switch_Wall(four.x , four.y - (carSquareSize/2), ["up", "right"], ["up"], lengthWall, thicknessWall);
        World.addEntity(wall4);
        
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