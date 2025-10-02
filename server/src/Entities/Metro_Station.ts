import { Base_Entity} from '#root/Entities/Base_Entity.js'
import type { Train_Car} from '#root/Entities/Train_Stuff/Train_Car.js'
import type { Station_Stop_Spot} from '#root/Entities/Station_Stop_Spot.js'
import type { Collision_Info, Direction} from '#root/Type_Stuff.js'
import type { Sliding_Door} from '#root/Entities/Sliding_Door.js'
import { My_Events, type Train_Reached_Station } from '#root/My_Events.js'

type Doors = {
    left: Sliding_Door[],
    right: Sliding_Door[],
    up: Sliding_Door[],
    down: Sliding_Door[],
    
  };



export class Metro_Station extends Base_Entity {

  constructor() {
    super();
    this.doors = doors;
    const thisStation= this;
    const Train_Reached_Station_Handler =  (event:
Train_Reached_Station)=>{
      const trainCar= event.trainCar;
      const train = trainCar.train;
      const spot = event.stopSpot;
      train.spot = spot;
      train.alignCars(event.collision)
      train.stop();
      train.setState("stoppingAtStation");
      My_Events.addEventListenerOnce(`Doors_Of_Train_At_Stop_Spot_${spot.id}_Opening`, (event)=>{
         thisStation.openDoors(spot.Which_Door_Of_A_Car_To_Open_And_Close)
      })
      My_Events.addEventListenerOnce(`Doors_Of_Train_At_Stop_Spot_${spot.id}_Closing`, (event)=>{
         thisStation.closeDoors(spot.Which_Door_Of_A_Car_To_Open_And_Close)
      })
    };
        My_Events.addEventListener(`Train_Reached_Station_${this.id}`,Train_Reached_Station_Handler)
  }
  updateState() {

    super.updateState();
  }
  openDoors(dir: Direction) {
    for (const door of this.doors[dir]) {
       door.open();
    }
  }
  closeDoors(dir: Direction) {
    for (const door of this.doors[dir]) {
       door.close();
    }
  }
  
}