import type { Train_Car} from '#root/Entities/Train_Stuff/Train_Car.js'
import type { Train} from '#root/Entities/Train_Stuff/Train.js'
import type { Station_Stop_Spot} from '#root/Entities/Station_Stop_Spot.js'
import type { Collision_Info} from '#root/Type_Stuff.js'
export type Train_Reached_Station = {
      trainCar: Train_Car,
     stopSpot: Station_Stop_Spot,
     collision: Collision_Info
    }

export type Doors_Of_Train_Opening = {
    train: Train,
    }
export type Doors_Of_Train_Closing = {
    train: Train,
    }