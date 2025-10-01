import { Base_Entity} from '#root/Entities/Base_Entity.js'
import type { Train_Car} from '#root/Entities/Train_Stuff/Train_Car.js'
import type { Station_Stop_Spot} from '#root/Entities/Station_Stop_Spot.js'
import type { Collision_Info} from '#root/Type_Stuff.js'
import { My_Events } from '#root/My_Events.js'

class Metro_Controller extends Base_Entity {
  updateState() {
    My_Events.addEventListener("Train_Reached_Station", (event:
    {
      trainCar: Train_Car,
     stopSpot: Station_Stop_Spot,
     collision: Collision_Info
    })=>{
      const trainCar= event.trainCar;
      const train = trainCar.train;
      const spot = event.stopSpot;
      train.spot = spot;
      train.alignCars(event.collision)
      train.stop();
    })
    super.updateState();
  }
}