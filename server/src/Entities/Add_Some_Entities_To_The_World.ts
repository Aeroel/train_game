import { Ground } from "#root/Entities/Ground.js";
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Position } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Wall } from "#root/Entities/Wall.js";
import { AssertThat } from "#root/My_Assertion_Functionality.js";
import { Rail_Switch_Wall} from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Railway_Placer, type Railway_Placer_Required_Inputs } from "#root/Entities/Railway_Placer.js";
export { Add_Some_Entities_To_The_World };


class Add_Some_Entities_To_The_World {
    static carSquareSize = 150;
    static railLength = 1000;
    static rails: Rail[] = [];
   
  
    static doItNow() {

        Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();

        Add_Some_Entities_To_The_World.addTheGround();
        
    // random wall
      const wall = World.addEntity(
        new Wall());
        wall.setXY(950, 1250);
        wall.setHeight(400);
        wall.setWidth(40);
        wall.setColor("pink")

      // random forcefield
        World.addEntity(new Forcefield());


     // the two railways
        const first_rail = Add_Some_Entities_To_The_World.addARailway(400, 200, 4000, 400);

        this.Put_A_Train_On_Rail(first_rail, ["down"], ["up"], "forwards");
    
        const sec_rail = Add_Some_Entities_To_The_World.addARailway2(900, 600, 3000, 350);

        this.Put_A_Train_On_Rail(sec_rail, ["up"], ["down"], "forwards");
        
        // testing if train stops upon reaching this statiom stop spot
        World.addEntity(
          new Station_Stop_Spot({
          x: 5710, y: 275, Which_Door_Of_A_Car_To_Open_And_Close:"down"})
          );
        World.addEntity(
          new Station_Stop_Spot({
          x:8800, y:2135,
          Which_Door_Of_A_Car_To_Open_And_Close:"left"
          })
          );
        World.addEntity(
          new Station_Stop_Spot({x:6000, y:4135, Which_Door_Of_A_Car_To_Open_And_Close:"up"})
          );
        World.addEntity(new Station_Stop_Spot({
          x:925, y:1500, Which_Door_Of_A_Car_To_Open_And_Close:"right"
          
        })
        );
        
        
       const thirdRailway = Add_Some_Entities_To_The_World.addThirdRailway(1400, 6600, 4000, 400);
        

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
   
       static Put_A_Train_On_Rail(rail: Rail, forwards: Train_Car_Motion_Directions, backwards: Train_Car_Motion_Directions, movementDirection: "forwards" | "backwards") {

        if (!(rail instanceof Rail) || !(rail.hasTag("Rail"))) {
            throw new Error(`Expects object of Rail, but got ${JSON.stringify(rail)}`);
        }
        const train = new Train(rail, forwards, backwards, movementDirection, 4, Add_Some_Entities_To_The_World.carSquareSize);
        World.addEntity(train)


    }
    
    static addTheGround() {
        const ground = new Ground();
        ground.setX(0);
        ground.setY(0);
        ground.setWidth(World.width);
        ground.setHeight(World.height);
        World.addEntity(ground);
        
        const groundTwo = new Ground({color: "darkgreen"});
        groundTwo.setX(0);
        groundTwo.setY(World.height);
        groundTwo.setWidth(World.width);
        groundTwo.setHeight(World.height);
        World.addEntity(groundTwo);
    }

    static addAWhiteRectangleForMovementReference() {
        const newEntity = new Base_Entity();
        newEntity.setX(0);
        newEntity.setY(0);
        newEntity.setWidth(50);
        newEntity.setHeight(40);
        World.addEntity(newEntity);
    }
    /* Examppe call: Add_Some_Entities_To_The_World.abstractAddThirdRailway({
         x: 4000,
         y: 7777,
         railLength: 4000,
         switchGapLength: 300,
        switchWallThickness: 15,
        switchWallLength: 120,
        carSquareSize: 150
  
     })
     */

    static abstractAddThirdRailway({x, y, railLength, switchGapLength, carSquareSize, switchWallThickness, switchWallLength}: Railway_Placer_Required_Inputs) {
      const railwayPlacer = new Railway_Placer({x, y, railLength, switchGapLength, carSquareSize, switchWallThickness, switchWallLength });
      
      const railPairOne = railwayPlacer.placeFirstPairOfRails("down");
      const railPairTwo = railwayPlacer.placeNextTo(railPairOne, "right");
      const railPairThree = railwayPlacer.placeNextTo(railPairTwo, "down");
      const railPairFour = railwayPlacer.placeNextTo(railPairThree, "right")
      
     railwayPlacer.placeUturnRails(railPairOne);
     railwayPlacer.placeUturnRails(railPairFour);
     
     railwayPlacer.generateRailSwitchWalls();
     
     
    }
    
    static addThirdRailway(x: number, y: number, mainLength: number, switchLength: number) {
const thicknessWall= 10;
const lengthWall = this.carSquareSize;
const half = 0.5*this.carSquareSize;
 
    //  BEGIN  railPairOne
    
        const railOne_B = Railway_Placing_Functionality.place(x,y,mainLength, "down", );
        
        const railOne_A = Railway_Placing_Functionality.place(x-400,y,mainLength+400, "down", );



       const railOne_A_Second_End = railOne_A.getEnd("secondEnd");
       const railOne_A_First_End = railOne_A.getEnd("firstEnd");
       const railOne_A_Down_Switch =
              World.addEntity(new Rail_Switch_Wall(
                railOne_A_Second_End.x - half, railOne_A_Second_End.y + half, ["down"], ["down","right"], lengthWall,thicknessWall
                ));
                
       const railOne_A_Up_Left_Switch =
              World.addEntity(new Rail_Switch_Wall(
                railOne_A_Second_End.x - half, railOne_A_Second_End.y - half, ["left", "up"], ["up"], thicknessWall,lengthWall
                ));
    // END railPairOne        



       const railTwo_B = Railway_Placing_Functionality.placeSwitch(railOne_B, "secondEnd", "right", switchLength, mainLength+400);

       const railTwo_A = Railway_Placing_Functionality.placeSwitch(railOne_A, "secondEnd", "right", switchLength, mainLength+400);
       
              const railTwo_A_First_End = railTwo_A.getEnd("firstEnd");
       const railTwo_A_Right_Down_Switch =
              World.addEntity(new Rail_Switch_Wall(
                railTwo_A_First_End.x - half, railTwo_A_First_End.y + half, ["right", "down"], ["right"], lengthWall,thicknessWall
                ));
                
       const railTwo_A_Left_Switch =
              World.addEntity(new Rail_Switch_Wall(
                railTwo_A_First_End.x - half, railTwo_A_First_End.y - half, ["left"], ["left","up"], thicknessWall,lengthWall
                )); 
       
       
       const railThree_B = Railway_Placing_Functionality.placeSwitch(railTwo_B, "secondEnd", "down", switchLength, mainLength);

       const railThree_A = Railway_Placing_Functionality.placeSwitch(railTwo_A, "secondEnd", "down", switchLength, mainLength);

       const railFour_B = Railway_Placing_Functionality.placeSwitch(railThree_B, "secondEnd", "right", switchLength, mainLength);

       const railFour_A = Railway_Placing_Functionality.placeSwitch(railThree_A, "secondEnd", "right", switchLength, mainLength+400);
       

       const railFive_B = Railway_Placing_Functionality.placeSwitch(railFour_B, "secondEnd", "up", 200, 500);
       
       const railSix_B = Railway_Placing_Functionality.placeSwitch(railFive_B, "firstEnd", "right", 200, 500);
       
       const railSeven_B = Railway_Placing_Functionality.placeSwitch(railSix_B, "secondEnd", "down", 200, 900);
       
       const railEight_B = Railway_Placing_Functionality.placeSwitch(railSeven_B, "secondEnd", "left", 200, 900);
       
               const railNegOne_A = Railway_Placing_Functionality.placeSwitch(railOne_A, "firstEnd", "left", 200, 500);
        
        const railNegTwo_A = Railway_Placing_Functionality.placeSwitch(railNegOne_A, "firstEnd", "up", 200, 500);
    
        const railNegThree_A = Railway_Placing_Functionality.placeSwitch(railNegTwo_A, "firstEnd", "right", 200, 900);

        const railNegFour_A = Railway_Placing_Functionality.placeSwitch(railNegThree_A, "secondEnd", "down", 200, 900);
        

    }
}