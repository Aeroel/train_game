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

      const wall = World.addEntity(
        new Wall());
        wall.setXY(950, 1250);
        wall.setHeight(400);
        wall.setWidth(40);
        wall.setColor("pink")

        World.addEntity(new Forcefield());

        const first_rail = Add_Some_Entities_To_The_World.addARailway(400, 200, 4000, 400);

        this.Put_A_Train_On_Rail(first_rail, "down", "up", "forwards");
    
        const sec_rail = Add_Some_Entities_To_The_World.addARailway2(900, 600, 3000, 350);

        this.Put_A_Train_On_Rail(sec_rail, "up", "down", "forwards");
         

    }

    static addARailway(x: number, y: number, mainLength: number, switchLength: number) {
        

        // extension dirs
        const firstDir = "down";
        const secondDir = "down";
        const thirdDir = "down";

        // ends
        const secondEnd = "bottomEnd";
        const thirdEnd = "rightEnd";

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));




        // left track
      //  const rail1_0 = Railway_Placing_Functionality.place(x, y, mainLength, firstDir);
        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength, secondDir, );
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "secondEnd", "right", switchLength, mainLength);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "rightEnd", "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "secondEnd", "up", switchLength, mainLength );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "firstEnd", "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0, "firstEnd", "left", mainLength)


const carSquareSize = Add_Some_Entities_To_The_World.carSquareSize;
const thicknessWall = 10;
const lengthWall = 150;
const offset = carSquareSize * 2;
const half = carSquareSize*0.5;
        const rail2BotEnd = rail2_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(rail2BotEnd))
        const wall = new Rail_Switch_Wall(rail2BotEnd.x - (half) , 
        rail2BotEnd.y + (half), ["down"], ["down", "right"], lengthWall, thicknessWall);
        World.addEntity(wall);
        
        const rail3LeftEnd = rail3_0.getEnd("firstEnd");
        console.log("is " + JSON.stringify(rail3LeftEnd))
        const wall2 = new Rail_Switch_Wall(rail3LeftEnd.x - half, rail3LeftEnd.y + half, ["down", "right"], ["right"], lengthWall, thicknessWall);
        World.addEntity(wall2);
        
        
       const three = rail4_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(three))
        const wall3 = new Rail_Switch_Wall(three.x +(carSquareSize/2), three.y- half, ["right"], ["right", "up"], thicknessWall, lengthWall);
        World.addEntity(wall3);
        
       const four = rail5_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(four))
        const wall4 = new Rail_Switch_Wall(four.x + half , four.y - (carSquareSize/2), ["up", "right"], ["up"], thicknessWall, lengthWall);
        World.addEntity(wall4);
        
        
        const five = rail5_0.getEnd("firstEnd")
        World.addEntity(new Rail_Switch_Wall(
          five.x - half, five.y - half, ["up"], ["up","left"], lengthWall, thicknessWall
          ));
          
          const six = rail6_0.getEnd("secondEnd");
          World.addEntity(new Rail_Switch_Wall(
            six.x - half, six.y - half, ["up", "left"], ["left"], lengthWall, thicknessWall
            ));
            
            const seven = rail7_0.getEnd("firstEnd");
            World.addEntity(new Rail_Switch_Wall(
              seven.x - (0.5*carSquareSize), seven.y-(0.5*carSquareSize), ["left"],["left", "down"], thicknessWall, lengthWall
              ));
              
              const eight = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                eight.x - half, eight.y - half, ["left", "down"], ["down"], thicknessWall,lengthWall
                ));
          
        return rail2_0;

    }

    static addARailway2(x: number, y: number, mainLength: number, switchLength: number) {
        

        // extension dirs
        const firstDir = "down";
        const secondDir = "down";
        const thirdDir = "down";

        // ends
        const secondEnd = "bottomEnd";
        const thirdEnd = "rightEnd";

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));




        // left track
      //  const rail1_0 = Railway_Placing_Functionality.place(x, y, mainLength, firstDir);
        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength + 200, secondDir, );
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "secondEnd", "right", switchLength, mainLength+1200);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "rightEnd", "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "secondEnd", "up", switchLength, mainLength+200 );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "firstEnd", "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0, "firstEnd", "left", mainLength+1200)


const carSquareSize = Add_Some_Entities_To_The_World.carSquareSize;
const half = 0.5*carSquareSize
const thicknessWall = 10;
const lengthWall = 150;
const offset = carSquareSize * 2;
        const rail2BotEnd = rail2_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(rail2BotEnd))
        const wall = new Rail_Switch_Wall(rail2BotEnd.x - half , 
        rail2BotEnd.y + half, ["down"], ["down", "right"], lengthWall, thicknessWall);
        World.addEntity(wall);
        
        const rail3LeftEnd = rail3_0.getEnd("firstEnd");
        console.log("is " + JSON.stringify(rail3LeftEnd))
        const wall2 = new Rail_Switch_Wall(rail3LeftEnd.x - half, rail3LeftEnd.y + half, ["down", "right"], ["right"], lengthWall, thicknessWall);
        World.addEntity(wall2);
        
        
       const three = rail4_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(three))
        const wall3 = new Rail_Switch_Wall(three.x + half, three.y - half, ["right"], ["right", "up"], thicknessWall, lengthWall);
        World.addEntity(wall3);
        
       const four = rail5_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(four))
        const wall4 = new Rail_Switch_Wall(four.x + half, four.y - half, ["up", "right"], ["up"], thicknessWall, lengthWall);
        World.addEntity(wall4);
        
        
        const five = rail5_0.getEnd("firstEnd")
        World.addEntity(new Rail_Switch_Wall(
          five.x - half, five.y - half, ["up"], ["up","left"], lengthWall, thicknessWall
          ));
          
          const six = rail6_0.getEnd("secondEnd");
          World.addEntity(new Rail_Switch_Wall(
            six.x - half, six.y - half, ["up", "left"], ["left"], lengthWall, thicknessWall
            ));
            
            const seven = rail7_0.getEnd("firstEnd");
            World.addEntity(new Rail_Switch_Wall(
              seven.x - (0.5*carSquareSize), seven.y-(0.5*carSquareSize), ["left"],["left", "down"], thicknessWall, lengthWall
              ));
              
              const eight = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                eight.x - (half), eight.y - half, ["left", "down"], ["down"], thicknessWall,lengthWall
                ));
            
     // below is sensors for the inner railway    

     const nine = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                nine.x - (0.5*carSquareSize), nine.y - (0.5*carSquareSize), ["up",], ["up","right"], lengthWall,thicknessWall
                ));

     const ten = rail7_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                ten.x - (0.5*carSquareSize), ten.y - (0.5*carSquareSize), ["up","right",], ["right"], lengthWall,thicknessWall
                ));  
              
           const eleven = rail6_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                eleven.x + (0.5*carSquareSize), eleven.y - (0.5*carSquareSize), ["right",], ["down","right"], thicknessWall,lengthWall
                ));
                
           const twelve = rail5_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                twelve.x + (0.5*carSquareSize), twelve.y - (0.5*carSquareSize), ["down","right",], ["down",], thicknessWall,lengthWall
                ));
                
           const thirteen = rail5_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                thirteen.x - (0.5*carSquareSize), thirteen.y + (0.5*carSquareSize), ["down",], ["down","left"], lengthWall,thicknessWall
                ));
                
           const fourteen = rail4_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                fourteen.x - (0.5*carSquareSize), fourteen.y + (0.5*carSquareSize), ["down","left"], ["left"], lengthWall,thicknessWall
                ));
                
           const fifteen = rail3_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                fifteen.x - (0.5*carSquareSize), fifteen.y - (0.5*carSquareSize), ["left"], ["left","up"], thicknessWall,lengthWall
                ));  
                
           const sixteen = rail2_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                sixteen.x - (0.5*carSquareSize), sixteen.y - (0.5*carSquareSize), ["left","up"], ["up"], thicknessWall,lengthWall
                ));          
                
                
          return rail2_0;
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