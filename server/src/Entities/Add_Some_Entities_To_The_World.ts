import { Ground } from "#root/Entities/Ground.js";
import { Railway_Switch_Wall_Generator } from "#root/Entities/Railway_Switch_Wall_Generator.js"
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Position, Orientation } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Wall } from "#root/Entities/Wall.js";
import { Assert } from "#root/Assert.js";
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
        
        
       const firstRailOutOfThirdRailway = Add_Some_Entities_To_The_World.addThirdRailway(1400, 6600, 4000, 400);
       
        this.Put_A_Train_On_Rail(firstRailOutOfThirdRailway, ["up"], ["down"], "forwards");
       
        

    }

static addRailwayAbstract() {
  
}

    static addARailway(x: number, y: number, mainLength: number, switchLength: number) {
        

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));





        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength, "down", );
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
        
        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));





        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength + 200, "down", );
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
      const carSquareSize = this.carSquareSize
const thicknessWall= 10;
const lengthWall = this.carSquareSize;
const half = 0.5*this.carSquareSize;
const thickHalf = thicknessWall + half;
const lenHalf = lengthWall + half;
 let returnRail: Rail;
    //  BEGIN  railPairOne
    const railOne_Dir = "down"
        const railOne_B = Railway_Placing_Functionality.place(x,y,mainLength, railOne_Dir );
         returnRail= railOne_B;
        const railOne_A = Railway_Placing_Functionality.place(x-400,y,mainLength+400, railOne_Dir, );
                

    // END railPairOne        



    // BEGIN railPairTwo
    const railTwo_Dir = "right";
       const railTwo_B = Railway_Placing_Functionality.placeSwitch(railOne_B, "secondEnd", railTwo_Dir, switchLength, mainLength+400);

       const railTwo_A = Railway_Placing_Functionality.placeSwitch(railOne_A, "secondEnd", railTwo_Dir, switchLength, mainLength+400);
                
       
       // END railPairTwo
       
      
      // BEGIN railPairThree
      const railThree_Dir = "down";
       const railThree_B = Railway_Placing_Functionality.placeSwitch(railTwo_B, "secondEnd", railThree_Dir, switchLength, mainLength);

       const railThree_A = Railway_Placing_Functionality.placeSwitch(railTwo_A, "secondEnd", railThree_Dir, switchLength, mainLength);

       // END railPairThree
 
 
       // BEGIN railPairFour
       const railFour_Dir = "right";
       const railFour_B = Railway_Placing_Functionality.placeSwitch(railThree_B, "secondEnd", railFour_Dir, switchLength, mainLength);

       const railFour_A = Railway_Placing_Functionality.placeSwitch(railThree_A, "secondEnd", railFour_Dir, switchLength, mainLength+400);
       // END railPairFour
       
       
       // BEGIN Uturn from railFour_A to railFour_B
             const railFourA_B_Uturn_1 = Railway_Placing_Functionality.placeSwitch(railFour_A, "secondEnd", "down", 200, 500);

       const railFourA_B_Uturn_2 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_1, "secondEnd", "right", 200, 500);
       
       const railFourA_B_Uturn_3 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_2, "secondEnd", "up", 200, 900);

       const railFourA_B_Uturn_4 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_3, "firstEnd", "left", 200, 900);
       // END Uturn from railFour_A to railFour_B
       
       // BEGIN Uturn from railOne_B to railOne_A
       
      const railOneB_A_Uturn_1 = Railway_Placing_Functionality.placeSwitch(railOne_B, "firstEnd", "right", 200, 500);
            
        const railOneB_A_Uturn_2 = Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_1, "secondEnd", "up", 200, 500);
     
          const railOneB_A_Uturn_3= Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_2, "firstEnd", "left", 200, 900);   
   
       const railOneB_A_Uturn_4 = Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_3, "firstEnd", "down", 200, 900);
     
        // END Uturn from railOneB to railOneA
     
     // BEGIN Connections 
    //skip railOne_A and railOneB_A_Uturn_4 because they are both vertical straigh rails so we treat them as one without any rail switching needed, train just goes up
  
      railOne_A.connectWith({otherRail: railTwo_A, otherEndName: "firstEnd", thisEndName:"secondEnd",} )  
   
      railTwo_A.connectWith({otherRail: railThree_A, otherEndName:"firstEnd", thisEndName:"secondEnd" })
   
      railThree_A.connectWith({otherRail: railFour_A, otherEndName: "firstEnd", thisEndName:"secondEnd",} ) 
      
      railFour_A.connectWith({otherRail: railFourA_B_Uturn_1, otherEndName: "firstEnd", thisEndName:"secondEnd",} )  
      
      railFourA_B_Uturn_1.connectWith({otherRail: railFourA_B_Uturn_2, otherEndName: "firstEnd", thisEndName:"secondEnd",} )  
      
      railFourA_B_Uturn_2.connectWith({otherRail: railFourA_B_Uturn_3, otherEndName: "secondEnd", thisEndName:"secondEnd",} )  
      
      railFourA_B_Uturn_3.connectWith({otherRail: railFourA_B_Uturn_4, otherEndName: "secondEnd", thisEndName:"firstEnd",} ) 

      // same as top, we do not need and in fact MUST NOT to connect this
     // railFourA_B_Uturn_4.connectWith({otherRail: railFour_B, otherEndName: "secondEnd", thisEndName:"firstEnd",} )  
      
      railFour_B.connectWith({otherRail: railThree_B, otherEndName: "secondEnd", thisEndName:"firstEnd",} )  
    
      railThree_B.connectWith({otherRail: railTwo_B, otherEndName: "secondEnd", thisEndName:"firstEnd",} )  
   
      railTwo_B.connectWith({otherRail: railOne_B, otherEndName: "secondEnd", thisEndName:"firstEnd",} )  
     
      railOne_B.connectWith({otherRail: railOneB_A_Uturn_1, otherEndName: "firstEnd", thisEndName:"firstEnd",} )  
    
      railOneB_A_Uturn_1.connectWith({otherRail: railOneB_A_Uturn_2, otherEndName: "secondEnd", thisEndName:"secondEnd",} ) 
      
      railOneB_A_Uturn_2.connectWith({otherRail: railOneB_A_Uturn_3, otherEndName: "secondEnd", thisEndName:"firstEnd",} ) 
      
      railOneB_A_Uturn_3.connectWith({otherRail: railOneB_A_Uturn_4, otherEndName: "firstEnd", thisEndName:"firstEnd",} )  
    
    // hmm...
      //railOneB_A_Uturn_4.connectWith({otherRail: railOne_A, otherEndName: "firstEnd", thisEndName:"firstEnd",} )  
      
      
      // END Connections
      
      
      // BEGIN Switch_Wall_Generation
      // order matters
       const railsArr: {rail: Rail,}[] = [
         {rail: railOne_A,},
         {rail: railTwo_A,},
          {rail: railThree_A,},
          {rail: railFour_A},
          {rail: railFourA_B_Uturn_1},
          {rail: railFourA_B_Uturn_2},
          {rail: railFourA_B_Uturn_3},
          {rail: railFourA_B_Uturn_4},
          { rail: railFour_B},
          { rail: railThree_B},
          { rail: railTwo_B},
          { rail: railOne_B},
          { rail: railOneB_A_Uturn_1 },
          { rail: railOneB_A_Uturn_2 },
          { rail: railOneB_A_Uturn_3 },
          { rail: railOneB_A_Uturn_4 },
         ];

        
        const gentor =  new Railway_Switch_Wall_Generator({
          railsArr,
          thicknessWall, carSquareSize
        })
        
        // END Switch_Wall_Generation
       return returnRail;
    }

}