import { Base_Entity} from '#root/Entities/Base_Entity.js'
import type { Train_Car} from '#root/Entities/Train_Stuff/Train_Car.js'
import type { Station_Stop_Spot} from '#root/Entities/Station_Stop_Spot.js'
import type { Collision_Info} from '#root/Type_Stuff.js'
import { My_Events, type Train_Reached_Station } from '#root/My_Events.js'


export class Metro_Station extends Base_Entity {
  constructor() {
    super();
    const Train_Reached_Station_Handler =  (event:
Train_Reached_Station)=>{
      const trainCar= event.trainCar;
      const train = trainCar.train;
      const spot = event.stopSpot;
      train.spot = spot;
      train.alignCars(event.collision)
      train.stop();
      train.setState("stoppingAtStation")
    };
        My_Events.addEventListener("Train_Reached_Station",Train_Reached_Station_Handler)
  }
  updateState() {

    super.updateState();
  }
  
}