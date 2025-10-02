import { Base_Entity } from "#root/Entities/Base_Entity.js"
import type { Metro_Station } from "#root/Entities/Metro_Station.js"
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import type { Sliding_Door } from "#root/Entities/Sliding_Door.js"


export class Metro_Controller exnteds Base_Entity {
  stations:
    {station: Metro_Station, stopSpots: Station_Stop_Spot[], doors:{left:Sliding_Door[], right: Sliding_Door[], up:Sliding_Door[], down: Sliding_Door[]}}[]=[];
  constructor() {
    super();
    this.addTag("Metro_Controller")
  }
  updateState() {
    super.updateState();
  }
}