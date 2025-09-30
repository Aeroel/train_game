import { Planet } from "#root/Entities/Planet.js";
import { log } from "#root/My_Log.js";
import { Bot } from "#root/Entities/Bot.js";
import { Car } from "#root/Entities/Car.js";
import { Railway_Switch_Wall_Generator } from "#root/Entities/Railway_Switch_Wall_Generator.js"
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Timer } from "#root/Entities/Timer/Timer.js";
import { Digit } from "#root/Entities/Timer/Timer.js";
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Position, Orientation } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Wall } from "#root/Entities/Wall.js";
import { My_Assert } from "#root/My_Assert.js";
import { Rail_Switch_Wall} from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Railway_Placer, type Railway_Placer_Required_Inputs } from "#root/Entities/Railway_Placer.js";
import { Chained_Placement } from "#root/Chained_Placement.js";

export { Add_Some_Entities_To_The_World };


class Add_Some_Entities_To_The_World {
    static carSquareSize = 150;
    static railLength = 1000;
    static railwayFenceWallThickness = 50;
    static rails: Rail[] = [];
   
  static randomWalls() {
          const wall = World.addEntity(
        new Wall());
        wall.setXY(950, 1250);
        wall.setHeight(400);
        wall.setWidth(40);
        wall.setColor("pink")
      const wall2 = World.addEntity(
        new Wall());
        wall2.setXY(wall.x + wall.width, 1250);
        wall2.setHeight(40);
        wall2.setWidth(400);
        wall2.setColor("pink")
      const wall3 = World.addEntity(
        new Wall());
        wall3.setXY(600, 600);
        wall3.setHeight(40);
        wall3.setWidth(400);
        wall3.setColor("pink")
        const thinWall = World.addEntity(
       new Wall())
       thinWall.setXY(400, -400).setWidth(1).setHeight(5000)

  }
    static doItNow() {


     const planet =   Add_Some_Entities_To_The_World.addThePlanet();
        
          Add_Some_Entities_To_The_World.addAWhiteRectangleForMovementReference();
    // random wall
    //  this.randomWalls()
       
      // random forcefield
        const ff = World.addEntity(new Forcefield());
        
        const digit  = World.addEntity(new Digit({x:240,y:250, width:25, height:25}))
        setInterval(()=>{
          if(digit.getValue()>= 9){
            return digit.setValue(0);
          }
          const newDigit = 1 + digit.getValue()
          My_Assert.that(Digit.isValidValue(newDigit));
          digit.setValue(newDigit)
        },1000)
        
      // const bot= World.addEntity(new Bot())
      // bot.setXY(2000, 2000).setHeight(300);
     //  planet.velocity.Add_To_Propagation_List(bot.velocity)
   // /*  
 const car = World.addEntity(
         new Car({x:1000,y:1000})
         .setXY(500,500)) 
        // */
        
       const firstRailOutOfThirdRailway = Add_Some_Entities_To_The_World.addThirdRailway(1400, 6600, 4000, 400);
       log(firstRailOutOfThirdRailway)
       
        this.Put_A_Train_On_Rail(firstRailOutOfThirdRailway, ["up"], ["down"], "forwards");
       this.surroundThirdWithWalls()

//this.randomWalls();
if(1>0)return;
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
        

    }

static addRailwayAbstract() {
  
}

    static addARailway(x: number, y: number, mainLength: number, switchLength: number) {
        

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));





        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength, "down", );
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "right", switchLength, mainLength);
        console.log(rail3_0)
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "up", switchLength, mainLength );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0,  "left", mainLength)


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
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "right", switchLength, mainLength+1200);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "up", switchLength, mainLength+200 );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0, "left", mainLength+1200)


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
        log(`Train spawned on ${JSON.stringify({x: train.x, y: train.y})}`)


    }
    
    static addThePlanet() {
        const planetOne = new Planet({color: "darkgreen"});
        planetOne.setX(-10000);
        planetOne.setY(-10000);
        planetOne.setWidth(World.width);
        planetOne.setHeight(World.height);
       return World.addEntity(planetOne);
  
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
 
static surroundThirdWithWalls() {

  const x=750;
  const y=5200;
  
   const wall1 = this.wallHelperPlace({x,y,direction:"right", length:1700});
   const wall2= this.wallHelperPlaceNextTo({wall: wall1, direction:"down",length: 1500  });
   const wall3= this.wallHelperPlaceNextTo({wall: wall2, direction:"left",length: 970  });
   const wall4= this.wallHelperPlaceNextTo({wall: wall3, direction:"down",length: 1045  });
   // small walls to let player through

   const wall5= this.wallHelperPlaceNextTo({wall: wall4, direction:"down",length: 500  });
      
   const wall8 = this.wallHelperPlaceNextTo({
     wall: wall5, direction:"down", length: 2000
   })
      
      // end of small walls
   const wall9 = this.wallHelperPlaceNextTo({
     wall: wall8, direction:"right", length: 700
   })
   
   // length controls y of platform wall
   const wall10= this.wallHelperPlaceNextTo({
     wall: wall9, direction:"down", length: 600
   })
   
   // length controls x of next platform wall
   const wall11= this.wallHelperPlaceNextTo({
     wall: wall10, direction:"right", length: 4600
   })
   
   const wall12= this.wallHelperPlaceNextTo({
     wall: wall11, direction:"down", length: 4500
   })
   const wall12p1= this.wallHelperPlaceNextTo({
     wall: wall12, direction:"right", length: 500
   })
   const wall12pf= this.wallHelperPlaceNextTo({
     wall: wall12p1, direction:"down", length: 300
   })
   
   const wall13= this.wallHelperPlaceNextTo({
     wall: wall12pf, direction:"right", length: 5000
   })
   
   const wall14= this.wallHelperPlaceNextTo({
     wall: wall13, direction:"down", length: 1600
   })
   const wall15= this.wallHelperPlaceNextTo({
     wall: wall14, direction:"left", length: 1300
   })
  
  // this one determines y of the long platform wall
   const wall16= this.wallHelperPlaceNextTo({
     wall: wall15, direction:"up", length: 700
   })
   const wall16p1= this.wallHelperPlaceNextTo({
     wall: wall16, direction:"left", length: 250
   })
   const wall16pf= this.wallHelperPlaceNextTo({
     wall: wall16p1, direction:"up", length: 250
   })
   
   const wall17= this.wallHelperPlaceNextTo({
     wall: wall16pf, direction:"left", length: 4750
   })
   const wall18= this.wallHelperPlaceNextTo({
     wall: wall17, direction:"up", length: 4500
   })
   const wall19= this.wallHelperPlaceNextTo({
     wall: wall18, direction:"left", length: 500
   })
   const wall20= this.wallHelperPlaceNextTo({
     wall: wall19, direction:"up", length: 300
   })
  
   const wall21= this.wallHelperPlaceNextTo({
     wall: wall20, direction:"left", length: 4700
   })
   const wall22= this.wallHelperPlaceNextTo({
     wall: wall21, direction:"up", length: 6300
   })
  
  const stationSize = 800;
  // station1 walls
  const s1x = 800;
  const s1y = 7400;
  
     const station1Wall1 = this.wallHelperPlace({x: s1x ,y: s1y,direction:"left", length:stationSize});
     const station1Wall2 = this.wallHelperPlaceNextTo({wall: station1Wall1 ,direction:"down", length:stationSize});
     const station1Wall3 = this.wallHelperPlaceNextTo({wall: station1Wall2 ,direction:"right", length:stationSize});
     
     // right platform
      const station1Wall4 = this.wallHelperPlace({x: s1x+700 ,y: s1y,direction:"right", length:stationSize});
         const station1Wall5 = this.wallHelperPlaceNextTo({wall: station1Wall4 ,direction:"down", length:stationSize});
     const station1Wall6 = this.wallHelperPlaceNextTo({wall: station1Wall5 ,direction:"left", length:stationSize});
     
     
       // station2 walls
  const s2x = 3100;
  const s2y = 10900;
  
     const station2Wall1 = this.wallHelperPlace({x: s2x ,y: s2y,direction:"up", length:stationSize});
     const station2Wall2 = this.wallHelperPlaceNextTo({wall: station2Wall1 ,direction:"right", length:stationSize});
     const station2Wall3 = this.wallHelperPlaceNextTo({wall: station2Wall2 ,direction:"down", length:stationSize});
     
     // right platform
      const station2Wall4 = this.wallHelperPlace({x: s2x ,y: s2y + 700,direction:"down", length:stationSize});
         const station2Wall5 = this.wallHelperPlaceNextTo({wall: station2Wall4 ,direction:"right", length:stationSize});
     const station2Wall6 = this.wallHelperPlaceNextTo({wall: station2Wall5 ,direction:"up", length:stationSize});
     
          // station3 walls
  const s3x = 6000
  const s3y = 13343;
  
     const station3Wall1 = this.wallHelperPlace({x: s3x ,y: s3y,direction:"left", length:stationSize});
     const station3Wall2 = this.wallHelperPlaceNextTo({wall: station3Wall1 ,direction:"down", length:stationSize});
     const station3Wall3 = this.wallHelperPlaceNextTo({wall: station3Wall2 ,direction:"right", length:stationSize});
     
     // right platform
      const station3Wall4 = this.wallHelperPlace({x: s3x + 700 ,y: s3y, direction:"right", length:stationSize});
         const station3Wall5 = this.wallHelperPlaceNextTo({wall: station3Wall4 ,direction:"down", length:stationSize});
     const station3Wall6 = this.wallHelperPlaceNextTo({wall: station3Wall5 ,direction:"left", length:stationSize});
     
  const s4x = 8632;
  const s4y = 15635;
  
     const station4Wall1 = this.wallHelperPlace({x: s4x ,y: s4y,direction:"up", length:stationSize});
     const station4Wall2 = this.wallHelperPlaceNextTo({wall: station4Wall1 ,direction:"right", length:stationSize});
     const station4Wall3 = this.wallHelperPlaceNextTo({wall: station4Wall2 ,direction:"down", length:stationSize});
     
     // bottom platform
      const station4Wall4 = this.wallHelperPlace({x: s4x ,y: s4y + 700, direction:"down", length:stationSize});
         const station4Wall5 = this.wallHelperPlaceNextTo({wall: station4Wall4 ,direction:"right", length:stationSize});
     const station4Wall6 = this.wallHelperPlaceNextTo({wall: station4Wall5 ,direction:"up", length:stationSize});
   
   /*
   I would like#2: autogenerate all this
   */
   /* I would like: more convenient way to place:
   this.wallHelperPlace()
   .wallHelperPlaceNextTo()
   .wallHelperPlaceNextTo()
   .wallHelperPlaceNextTo()
   */
  
}
static wallHelperPlaceNextTo({wall, direction, length}: {wall: Wall, direction: Direction, length: number}) {
  const newWall=new Wall();
  newWall.setColor("pink");
  World.addEntity(newWall);
    Chained_Placement.placeNextTo({
    otherEntity: wall,
    newEntity: newWall,
    extendsInDirection: direction, length, thickness: this.railwayFenceWallThickness
    })
    return newWall;
}
static wallHelperPlace({x, y, direction, length}:{x:number,y: number, direction: Direction, length: number})   {
 const thickness = this.railwayFenceWallThickness;
  const wall = World.addEntity(
    new Wall(
      ))
  wall.setColor("pink");

  Chained_Placement.place({
    entity:wall,
    x,
    y,
    length,
    direction,
    thickness
  })
  return wall;

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
       const railTwo_B = Railway_Placing_Functionality.placeSwitch(railOne_B, railTwo_Dir, switchLength, mainLength+400);

       const railTwo_A = Railway_Placing_Functionality.placeSwitch(railOne_A, railTwo_Dir, switchLength, mainLength+400);
                
       
       // END railPairTwo
       
      
      // BEGIN railPairThree
      const railThree_Dir = "down";
       const railThree_B = Railway_Placing_Functionality.placeSwitch(railTwo_B, railThree_Dir, switchLength, mainLength);

       const railThree_A = Railway_Placing_Functionality.placeSwitch(railTwo_A, railThree_Dir, switchLength, mainLength);

       // END railPairThree
 
 
       // BEGIN railPairFour
       const railFour_Dir = "right";
       const railFour_B = Railway_Placing_Functionality.placeSwitch(railThree_B, railFour_Dir, switchLength, mainLength);

       const railFour_A = Railway_Placing_Functionality.placeSwitch(railThree_A, railFour_Dir, switchLength, mainLength+400);
       // END railPairFour
       
       
       // BEGIN Uturn from railFour_A to railFour_B
             const railFourA_B_Uturn_1 = Railway_Placing_Functionality.placeSwitch(railFour_A, "down", 200, 500);

       const railFourA_B_Uturn_2 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_1, "right", 200, 500);
       
       const railFourA_B_Uturn_3 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_2,"up", 200, 900);

       const railFourA_B_Uturn_4 = Railway_Placing_Functionality.placeSwitch(railFourA_B_Uturn_3, "left", 200, 900);
       // END Uturn from railFour_A to railFour_B
       
       // BEGIN Uturn from railOne_B to railOne_A
       
      const railOneB_A_Uturn_1 = Railway_Placing_Functionality.placeSwitch(railOne_B, "right", 200, 500);
            
        const railOneB_A_Uturn_2 = Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_1, "up", 200, 500);
     
          const railOneB_A_Uturn_3= Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_2, "left", 200, 900);   
   
       const railOneB_A_Uturn_4 = Railway_Placing_Functionality.placeSwitch(railOneB_A_Uturn_3, "down", 200, 900);
     
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