import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Direction } from "#root/Type_Stuff.js";
import { My_Events, type Train_Reached_Station } from "#root/My_Events.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
export {
    Station_Stop_Spot
}

interface Station_Stop_Spot_Constructor {
  x: number, y: number, Which_Door_Of_A_Car_To_Open_And_Close:Direction
  
}

class Station_Stop_Spot extends Base_Entity {
    color = 'blue';
    Which_Door_Of_A_Car_To_Open_And_Close: Direction = "right";
    constructor({x, y, Which_Door_Of_A_Car_To_Open_And_Close}: Station_Stop_Spot_Constructor) {
        super();
        this.x=x;
        this.y=y;
        this.height = 100;
        this.width = this.height;
        this.Which_Door_Of_A_Car_To_Open_And_Close = Which_Door_Of_A_Car_To_Open_And_Close
        this.addTag("Station_Stop_Spot");
    }
    updateState() {
      const thisSpot = this;
      const trainContact = Collision_Stuff.getClosestCollision(this, (contactEntity)=>{
        if(!contactEntity.hasTag("Train_Car")) {
          return false;
        }
        const trainCar = <Train_Car>contactEntity;
        if(trainCar.train.spot === thisSpot) {
          return false;
        }
        return true;
      })
      if(trainContact) {
        const trainCar = <Train_Car>trainContact.entityB;
       const eventData: Train_Reached_Station = {trainCar: trainCar,collision: trainContact, stopSpot: this};
        My_Events.emit(`Train_Reached_Station`, eventData)
      }
      super.updateState();
    }
}