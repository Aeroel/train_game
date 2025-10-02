import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { My_Events, type Train_Reached_Station, type Doors_Of_Train_Opening, type Doors_Of_Train_Closing } from "#root/My_Events.js"
import type { Metro_Station } from "#root/Entities/Metro_Station.js"
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import type { Sliding_Door } from "#root/Entities/Sliding_Door.js"
import type { Direction } from "#root/Type_Stuff.js"


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
      const Doors_Of_Train_Opening_Handler = () => {
       const station = thisController.findStation(spot);
       thisController.openStationDoors(station, spot.Which_Door_Of_A_Car_To_Open_And_Close)
    }
      My_Events.addEventListenerOnce(`Doors_Of_Train_${train.id}_Opening`, Doors_Of_Train_Opening_Handler)
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

findStation(spot: Station_Stop_Spot): Metro_Station {
  for (const entry of this.stations) {
    if (entry.stopSpots.includes(spot)) {
      return entry.station;
    }
  }
  throw new Error("Was not able to find station for spot");
}
  openStationDoors(station:Metro_Station, dir: Direction) {
    const doors = this.getDoors(station, dir);
    for (const door of doors) {
       door.open();
    }
  }
  closeStationDoors(station: Metro_Station,dir: Direction) {
    const doors = this.getDoors(station, dir);
    for (const door of doors) {
       door.close();
    }
  }
  getDoors(station: Metro_Station, dir: Direction): Sliding_Door[] {
  const entry = this.stations.find(e => e.station === station);
  if (!entry) {
    throw new Error("Station not found in Metro_Controller");
  }
  const doors = entry.doors[dir];
  if (!doors) {
    throw new Error(`Direction '${dir}' does not exist for station doors`);
  }
  return doors;
}


}