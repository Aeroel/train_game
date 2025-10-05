import { Planet } from "#root/Entities/Planet.js";
import { log } from "#root/My_Log.js";
import { Bot } from "#root/Entities/Bot.js";
import { Car } from "#root/Entities/Car.js";
import { Railway_Switch_Wall_Generator } from "#root/Entities/Railway_Switch_Wall_Generator.js"
import { Base_Entity } from '#root/Entities/Base_Entity.js';
import { Sliding_Door } from '#root/Entities/Sliding_Door.js';
import { Railway_Placing_Functionality } from "#root/Entities/Train_Stuff/Railway_Placing_Functionality.js";
import { Timer } from "#root/Entities/Timer/Timer.js";
import { Digit } from "#root/Entities/Timer/Timer.js";
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import { World } from "#root/World.js";
import { Forcefield } from "#root/Entities/Forcefield.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import { Catapult_Travel } from "#root/Entities/Catapult_Travel.js";
import type { Direction, Position, Orientation } from "#root/Type_Stuff.js";
import { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Sliding_Door_Sensor } from "#root/Entities/Sliding_Door_Sensor.js";
import { Wall } from "#root/Entities/Wall.js";
import { My_Assert } from "#root/My_Assert.js";
import { Rail_Switch_Wall} from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Railway_Placer, type Railway_Placer_Required_Inputs } from "#root/Entities/Railway_Placer.js";
import { Chained_Placement } from "#root/Chained_Placement.js";
import { Metro_Station } from "#root/Entities/Metro_Station.js";
import { Metro_Controller } from "#root/Entities/Metro_Controller.js";

export { Add_Some_Entities_To_The_World };


class Add_Some_Entities_To_The_World {
  static metroController: Metro_Controller =  World.addEntity(new Metro_Controller());
    static carSquareSize = 150;
    static railLength = 1000;
    static railwayFenceWallThickness = 50;
    static trainCarWallThickness = 5;
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
        const train = new Train(rail, forwards, backwards, movementDirection, 4, Add_Some_Entities_To_The_World.carSquareSize, Add_Some_Entities_To_The_World.trainCarWallThickness);
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
   const wall4= this.wallHelperPlaceNextTo({wall: wall3, direction:"down",length: 745  });
   // small walls to let player through

   let wall5Filler= this.wallHelperPlaceNextTo({wall: wall4, direction:"down",length: 800  });
      
   const wall8 = this.wallHelperPlaceNextTo({
     wall: wall5Filler, direction:"down", length: 2000
   })
    // it was just filler
      World.removeEntity(wall5Filler);
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
  
  // ref for station 2
   const wall21= this.wallHelperPlaceNextTo({
     wall: wall20, direction:"left", length: 4700
   })
   // 22 is to be used as reference for station 1
   const wall22= this.wallHelperPlaceNextTo({
     wall: wall21, direction:"up", length: 3250
   })
   const stationSize = 800;
  const wall23= this.wallHelperPlaceNextTo({
     wall: wall22, direction:"up", length: 6300-3250-stationSize
   }) 
   wall23.setY(wall23.getY()-stationSize)
  
  const s1Reference = wall22;
  const s2Reference = wall21;
  const s3Reference = wall18;
  const s4Reference = wall17;
  
  
  const s1DistBetweenPlatforms = 600;
  const s2DistBetweenPlatforms = 600;
  const s3DistBetweenPlatforms = 800;
  const s4DistBetweenPlatforms = 600;
  // station1 walls
  const s1x = s1Reference.x + s1Reference.width + 50;
  const s1y = 7400;
  
  
  const s1StopSpotWalls = this.placeStation(s1x, s1y, stationSize, s1DistBetweenPlatforms, "horizontal")
  const s1WallLeft = s1StopSpotWalls[0];
  const s1WallRightTop = s1StopSpotWalls[1];
  const s1StopSpot1 = World.addEntity(
      new Station_Stop_Spot({x: s1WallLeft.x + s1WallLeft.width, y: s1WallLeft.y, Which_Door_Of_A_Car_To_Open_And_Close:"left"})
      )
  s1StopSpot1.setX(900);
  s1StopSpot1.setWidth(this.carSquareSize);
  s1StopSpot1.setHeight(this.carSquareSize/5);
  // doors
  const s1WallBelowDoor1 = World.addEntity(
      new Wall()
      )
  const s1SlidingDoor1 = World.addEntity(
    new Sliding_Door(
      "down"
      )
    )
  const s1SlidingDoor2 = World.addEntity(
    new Sliding_Door(
      "up"
      )
    )
    const s1WallBetweenDoors2And3= World.addEntity(
      new Wall()
      )
  const s1SlidingDoor3 = World.addEntity(
    new Sliding_Door(
      "down"
      )
    )
  const s1SlidingDoor4 = World.addEntity(
    new Sliding_Door(
      "up"
      )
    )
    
            const s1WallBetweenDoors4And5= World.addEntity(
      new Wall()
      )
    
  const s1SlidingDoor5 = World.addEntity(
    new Sliding_Door(
      "down"
      )
    )

  const s1SlidingDoor6 = World.addEntity(
    new Sliding_Door(
      "up"
      )
    )
    
     const s1WallBetweenDoors6And7= World.addEntity(
      new Wall()
      )
    
  const s1SlidingDoor7 = World.addEntity(
    new Sliding_Door(
      "down"
      )
    )
  const s1SlidingDoor8 = World.addEntity(
    new Sliding_Door(
      "up"
      )
    )
         const s1WallAboveDoor8= World.addEntity(
      new Wall()
      )
    
      
    const css14 = Add_Some_Entities_To_The_World.carSquareSize / 4;
    s1SlidingDoor1.setXYWH(s1StopSpot1.x - this.railwayFenceWallThickness, s1StopSpot1.y - css14 - css14 , this.railwayFenceWallThickness, css14);
    s1WallBelowDoor1.setXYWH(s1SlidingDoor1.x, s1SlidingDoor1.y + s1SlidingDoor1.height, this.railwayFenceWallThickness, css14);
    s1SlidingDoor2.setXYWH(s1SlidingDoor1.x, s1SlidingDoor1.y - css14, this.railwayFenceWallThickness, css14);
    
    s1SlidingDoor3.setXYWH(s1SlidingDoor2.x, s1SlidingDoor2.y - css14 - css14 - css14 , this.railwayFenceWallThickness, css14);
    s1WallBetweenDoors2And3.setXYWH(s1SlidingDoor3.x, s1SlidingDoor3.y + s1SlidingDoor3.height, s1SlidingDoor3.width, (s1SlidingDoor2.y - s1SlidingDoor2.height - s1SlidingDoor3.y))
    s1SlidingDoor4.setXYWH(s1SlidingDoor3.x, s1SlidingDoor3.y - css14, this.railwayFenceWallThickness, css14);
   
   
    s1SlidingDoor5.setXYWH(s1SlidingDoor4.x, s1SlidingDoor4.y - css14 - css14 - css14 , this.railwayFenceWallThickness, css14);
    
               s1WallBetweenDoors4And5.setXYWH(s1SlidingDoor5.x, s1SlidingDoor5.y + s1SlidingDoor5.height, s1SlidingDoor5.width, (s1SlidingDoor4.y - s1SlidingDoor4.height - s1SlidingDoor5.y))
    

    s1SlidingDoor6.setXYWH(s1SlidingDoor5.x, s1SlidingDoor5.y - css14, this.railwayFenceWallThickness, css14);

    s1SlidingDoor7.setXYWH(s1SlidingDoor6.x, s1SlidingDoor6.y - css14 - css14 - css14 , this.railwayFenceWallThickness, css14);
    
       s1WallBetweenDoors6And7.setXYWH(s1SlidingDoor7.x, s1SlidingDoor7.y + s1SlidingDoor7.height, s1SlidingDoor7.width, (s1SlidingDoor6.y - s1SlidingDoor6.height - s1SlidingDoor7.y))
    
    
    s1SlidingDoor8.setXYWH(s1SlidingDoor7.x, s1SlidingDoor7.y - css14, this.railwayFenceWallThickness, css14);
   
   s1WallAboveDoor8.setXYWH(s1SlidingDoor8.x, s1SlidingDoor8.y - (stationSize*0.4), this.railwayFenceWallThickness, (stationSize*0.4))
   
         // doors ended above
      
    // doors for right side 
    
   const smallOffset = 0
     const s1RSBarrierWall1 = World.addEntity(
       new Wall())
       s1RSBarrierWall1.setX(s1WallRightTop.x)
       s1RSBarrierWall1.setY(s1WallRightTop.y + s1WallRightTop.height)
      s1RSBarrierWall1.setHeight(css14 + smallOffset);
      s1RSBarrierWall1.setWidth(this.railwayFenceWallThickness);
     const s1RSBarrierWallsCount = 16 - 1;
    let currWall: Wall = s1RSBarrierWall1;
    const s1RSBarrierWalls: Wall[]=[];
     for(let i =1; i <= s1RSBarrierWallsCount; i++) {
       
     }
     const s1RSBarrierWall2 = World.addEntity(
       new Wall())
       s1RSBarrierWall2.setX(s1WallRightTop.x)
       s1RSBarrierWall2.setY(s1RSBarrierWall1.y + s1RSBarrierWall1.height)
      s1RSBarrierWall2.setHeight(css14);
      s1RSBarrierWall2.setWidth(this.railwayFenceWallThickness);
      
     const s1RSBarrierWall3 = World.addEntity(
       new Wall())
       s1RSBarrierWall3.setX(s1WallRightTop.x)
       s1RSBarrierWall3.setY(s1RSBarrierWall2.y + s1RSBarrierWall2.height)
      s1RSBarrierWall3.setHeight(css14 - smallOffset *2);
      s1RSBarrierWall3.setWidth(this.railwayFenceWallThickness);
      
     const s1RSBarrierWall4 = World.addEntity(
       new Wall())
       s1RSBarrierWall4.setX(s1WallRightTop.x)
       s1RSBarrierWall4.setY(s1RSBarrierWall3.y + s1RSBarrierWall3.height)
      s1RSBarrierWall4.setHeight(css14 + smallOffset);
      s1RSBarrierWall4.setWidth(this.railwayFenceWallThickness);
     const s1RSBarrierWall5 = World.addEntity(
       new Wall())
       s1RSBarrierWall5.setX(s1WallRightTop.x)
       s1RSBarrierWall5.setY(s1RSBarrierWall4.y + s1RSBarrierWall4.height)
      s1RSBarrierWall5.setHeight(css14 + smallOffset);
      s1RSBarrierWall5.setWidth(this.railwayFenceWallThickness);
      
      
     const s1RSBarrierWall6 = World.addEntity(
       new Wall())
       s1RSBarrierWall6.setX(s1WallRightTop.x)
       s1RSBarrierWall6.setY(s1RSBarrierWall5.y + s1RSBarrierWall5.height)
      s1RSBarrierWall6.setHeight(css14);
      s1RSBarrierWall6.setWidth(this.railwayFenceWallThickness);
 
     const s1RSBarrierWall7 = World.addEntity(
       new Wall())
       s1RSBarrierWall7.setX(s1WallRightTop.x)
       s1RSBarrierWall7.setY(s1RSBarrierWall6.y + s1RSBarrierWall6.height)
      s1RSBarrierWall7.setHeight(css14 - smallOffset * 2);
      s1RSBarrierWall7.setWidth(this.railwayFenceWallThickness);
   
     const s1RSBarrierWall8 = World.addEntity(
       new Wall())
       s1RSBarrierWall8.setX(s1WallRightTop.x)
       s1RSBarrierWall8.setY(s1RSBarrierWall7.y + s1RSBarrierWall7.height)
      s1RSBarrierWall8.setHeight(css14 + smallOffset);
      s1RSBarrierWall8.setWidth(this.railwayFenceWallThickness);
  
     const s1RSBarrierWall9 = World.addEntity(
       new Wall())
       s1RSBarrierWall9.setX(s1WallRightTop.x)
       s1RSBarrierWall9.setY(s1RSBarrierWall8.y + s1RSBarrierWall8.height)
      s1RSBarrierWall9.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall9.setWidth(this.railwayFenceWallThickness);
   
   
     const s1RSBarrierWall10 = World.addEntity(
       new Wall())
       s1RSBarrierWall10.setX(s1WallRightTop.x)
       s1RSBarrierWall10.setY(s1RSBarrierWall9.y + s1RSBarrierWall9.height)
      s1RSBarrierWall10.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall10.setWidth(this.railwayFenceWallThickness);
    
     const s1RSBarrierWall11 = World.addEntity(
       new Wall())
       s1RSBarrierWall11.setX(s1WallRightTop.x)
       s1RSBarrierWall11.setY(s1RSBarrierWall10.y + s1RSBarrierWall10.height)
      s1RSBarrierWall11.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall11.setWidth(this.railwayFenceWallThickness);
   
     const s1RSBarrierWall12 = World.addEntity(
       new Wall())
       s1RSBarrierWall12.setX(s1WallRightTop.x)
       s1RSBarrierWall12.setY(s1RSBarrierWall11.y + s1RSBarrierWall11.height)
      s1RSBarrierWall12.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall12.setWidth(this.railwayFenceWallThickness);
  
     const s1RSBarrierWall13 = World.addEntity(
       new Wall())
       s1RSBarrierWall13.setX(s1WallRightTop.x)
       s1RSBarrierWall13.setY(s1RSBarrierWall12.y + s1RSBarrierWall12.height)
      s1RSBarrierWall13.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall13.setWidth(this.railwayFenceWallThickness);
   
     const s1RSBarrierWall14 = World.addEntity(
       new Wall())
       s1RSBarrierWall14.setX(s1WallRightTop.x)
       s1RSBarrierWall14.setY(s1RSBarrierWall13.y + s1RSBarrierWall13.height)
      s1RSBarrierWall14.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall14.setWidth(this.railwayFenceWallThickness);
      
     const s1RSBarrierWall15 = World.addEntity(
       new Wall())
       s1RSBarrierWall15.setX(s1WallRightTop.x)
       s1RSBarrierWall15.setY(s1RSBarrierWall14.y + s1RSBarrierWall14.height)
      s1RSBarrierWall15.setHeight(css14 + smallOffset * 2);
      s1RSBarrierWall15.setWidth(this.railwayFenceWallThickness);
      
        const rem = stationSize - ( css14 * 15)
     const s1RSBarrierWall16 = World.addEntity(
       new Wall())
       s1RSBarrierWall16.setX(s1WallRightTop.x)
       s1RSBarrierWall16.setY(s1RSBarrierWall15.y + s1RSBarrierWall15.height)
      s1RSBarrierWall16.setHeight(rem);
      s1RSBarrierWall16.setWidth(this.railwayFenceWallThickness);

      const wallsAsSlidingDoors: Wall[]=[];
      wallsAsSlidingDoors.push(s1RSBarrierWall2)
      wallsAsSlidingDoors.push(s1RSBarrierWall3)
      
      wallsAsSlidingDoors.push(s1RSBarrierWall6)
      wallsAsSlidingDoors.push(s1RSBarrierWall7)
      
      wallsAsSlidingDoors.push(s1RSBarrierWall10)
      wallsAsSlidingDoors.push(s1RSBarrierWall11)
      
      wallsAsSlidingDoors.push(s1RSBarrierWall14)
      wallsAsSlidingDoors.push(s1RSBarrierWall15)
      

      let i = 1;
      const s1RSSlidingDoors:Sliding_Door[]=[];
      for(const wall of wallsAsSlidingDoors) {
        const isEven =  (i % 2)===0;
        i++;
        let dir:Direction="up";
        if(isEven) dir = "down";
            const slidingDoor1= World.addEntity(
       new Sliding_Door(dir)
       )
       slidingDoor1.setXYWH(wall.x, wall.y, wall.width, wall.height)
         s1RSSlidingDoors.push(slidingDoor1)

         World.removeEntity(wall);
      }
      
    // ended above 
      
      
  const s1StopSpot2 = World.addEntity(
      new Station_Stop_Spot({x: s1WallRightTop.x, y: s1WallRightTop.y, Which_Door_Of_A_Car_To_Open_And_Close:"right"})
      )
      

      
      s1StopSpot2.setWidth(this.carSquareSize);
      s1StopSpot2.setHeight(this.carSquareSize/5);
      s1StopSpot2.setX(1300)
      s1StopSpot2.setY(s1StopSpot2.y + (s1WallRightTop.height - s1StopSpot2.height))


      const ms1=  World.addEntity(new Metro_Station());
      const ct = World.addEntity(new Catapult_Travel());
      ct.setGatePosition({gateNumber:1, position: {
        x: 640, y: 7560
      }})
      ct.setGatePosition({gateNumber:2, position: {
        x: 1740, y: 7560
      }})

      this.metroController.addStation({
        station: ms1, stopSpots: [s1StopSpot1, s1StopSpot2], doors: {left: [
          s1SlidingDoor1,
          s1SlidingDoor2,
          s1SlidingDoor3,
          s1SlidingDoor4,
          s1SlidingDoor5,
          s1SlidingDoor6,
          s1SlidingDoor7,
          s1SlidingDoor8,
          ], right:[...s1RSSlidingDoors], down:[], up:[]}
      })
  
       // station2 walls
  const s2x = 3100;
  const s2y = s2Reference.y
   
    this.placeStation(s2x, s2y, stationSize, s2DistBetweenPlatforms, "vertical")

     
          // station3 walls
  const s3x = s3Reference.x
  const s3y = 13343;
  
      this.placeStation(s3x, s3y, stationSize, s3DistBetweenPlatforms, "horizontal")

     
  const s4x = 8632;
  const s4y = s4Reference.y;
  
      this.placeStation(s4x, s4y, stationSize, s4DistBetweenPlatforms, "vertical")

   
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

static placeStation(sx: number, sy: number, stationSize: number, sDistBetweenPlatforms: number, orientation: Orientation) {
   const stopSpotWalls: Base_Entity[] =[];
     if(orientation === "horizontal") {
       const slidingDoorLength = stationSize/10;
     const stationWall1 = this.wallHelperPlace({x: sx ,y: sy,direction:"left", length:stationSize});
     const sideWallLength = (stationSize - slidingDoorLength) / 2;
     
     const stationWall2_1 = this.wallHelperPlaceNextTo({wall: stationWall1 ,direction:"down", length:sideWallLength});

     const slidingDoorX = stationWall2_1.x;
     const slidingDoorY = stationWall2_1.y + stationWall2_1.height;
    const slidingDoor1= World.addEntity(
       new Sliding_Door("down")
       )
       slidingDoor1.setXYWH(slidingDoorX, slidingDoorY, stationWall2_1.width, slidingDoorLength)
       World.addEntity(
         new Sliding_Door_Sensor(slidingDoor1, (contactEntity)=>contactEntity.hasTag("Player"))
         );
         
     const stationWall2_2 = this.wallHelperPlaceNextTo({wall: stationWall2_1 ,direction:"down", length:sideWallLength});
     stationWall2_2.setY(stationWall2_2.y + slidingDoorLength)
     
     const stationWall3 = this.wallHelperPlaceNextTo({wall: stationWall2_2,direction:"right", length:stationSize});
     
     // right platform
      const stationWall4 = this.wallHelperPlace({x: sx+sDistBetweenPlatforms ,y: sy,direction:"right", length:stationSize});
    //sliding door wall
      const stationWall5_1 = this.wallHelperPlaceNextTo({wall: stationWall4 ,direction:"down", length:sideWallLength});

     const slidingDoorX2 = stationWall5_1.x;
     const slidingDoorY2 = stationWall5_1.y + stationWall5_1.height;
    const slidingDoor2= World.addEntity(
       new Sliding_Door("down")
       )
       slidingDoor2.setXYWH(slidingDoorX2, slidingDoorY2, stationWall5_1.width, slidingDoorLength)
       World.addEntity(
         new Sliding_Door_Sensor(slidingDoor2, (contactEntity)=>contactEntity.hasTag("Player"))
         );
         
     const stationWall5_2 = this.wallHelperPlaceNextTo({wall: stationWall5_1 ,direction:"down", length:sideWallLength});
     stationWall5_2.setY(stationWall5_2.y + slidingDoorLength)

    // end 

     const stationWall6 = this.wallHelperPlaceNextTo({wall: stationWall5_2,direction:"left", length:stationSize});
     stopSpotWalls.push(stationWall3)
     stopSpotWalls.push(stationWall4)
     return stopSpotWalls;
     } else  {
            const stationWall1 = this.wallHelperPlace({x: sx ,y: sy,direction:"down", length:stationSize});
     const stationWall2 = this.wallHelperPlaceNextTo({wall: stationWall1 ,direction:"right", length:stationSize});
     const stationWall3 = this.wallHelperPlaceNextTo({wall: stationWall2 ,direction:"up", length:stationSize});
     
     // bottom platform
      const stationWall4 = this.wallHelperPlace({x: sx ,y: sy - sDistBetweenPlatforms,direction:"up", length:stationSize});
         const stationWall5 = this.wallHelperPlaceNextTo({wall: stationWall4 ,direction:"right", length:stationSize});
     const stationWall6 = this.wallHelperPlaceNextTo({wall: stationWall5 ,direction:"down", length:stationSize});
    stopSpotWalls.push(stationWall3)
     stopSpotWalls.push(stationWall4)
     return stopSpotWalls;
     }
     
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