import { Base_Entity} from '#root/Entities/Base_Entity.js'
import type { Train_Car} from '#root/Entities/Train_Stuff/Train_Car.js'
import type { Station_Stop_Spot} from '#root/Entities/Station_Stop_Spot.js'
import type { Collision_Info, Direction} from '#root/Type_Stuff.js'
import type { Sliding_Door} from '#root/Entities/Sliding_Door.js'
import { My_Events, type Train_Reached_Station } from '#root/My_Events.js'



export class Metro_Station extends Base_Entity {

  constructor() {
    super();

  }
  updateState() {

    super.updateState();
  }
  
}