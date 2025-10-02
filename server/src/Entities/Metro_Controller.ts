import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { My_Events, type Train_Reached_Station } from "#root/My_Events.js"
import type { Metro_Station } from "#root/Entities/Metro_Station.js"
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import type { Sliding_Door } from "#root/Entities/Sliding_Door.js"


export class Metro_Controller extends Base_Entity {
  stations:
    {
      station: Metro_Station, 
      stopSpots: Station_Stop_Spot[], 
      doors:{
        left:Sliding_Door[], right: Sliding_Door[], up:Sliding_Door[], down: Sliding_Door[]
      }
      
    }[]=[];
  constructor() {
    super();
    this.addTag("Metro_Controller");
    const thisController = this;
    const Train_Reached_Station_Handler =  (event:
Train_Reached_Station)=>{
      const trainCar= event.trainCar;
      const train = trainCar.train;
      const spot = event.stopSpot;
      train.spot = spot;
      train.alignCars(event.collision)
      train.stop();
      train.setState("stoppingAtStation");
    };
        My_Events.addEventListener(`Train_Reached_Station`,Train_Reached_Station_Handler)
  }
  updateState() {
    super.updateState();
  }
  addStation({station, stopSpots, doors}:
  {
    station: Metro_Station, stopSpots: Station_Stop_Spot[], doors: {
      left: Sliding_Door[], right: Sliding_Door[], up: Sliding_Door[], down: Sliding_Door[]
    }
  }) {
    this.stations.push({
      station, stopSpots, doors
    })
  }

}