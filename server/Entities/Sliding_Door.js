import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sensor } from "#root/Entities/Sensor.js"
import {World} from "#root/World.js"
export { Sliding_Door };

class Sliding_Door extends Base_Entity {
    color = "blue";
    possibleStates = ['closed', 'closing', 'opened', 'opening'];
    state = 'closed';
    Possible_Sliding_Open_Directions = ['right', 'left', 'up', 'down'];
    Which_Direction_The_Door_Slides_When_Opening;
    Door_Finished_Opening_Sensor;
    Door_Finished_Closing_Sensor;
    setXYWH(x,y,w,h) {
      super.setXYWH(x,y,w,h);
      this.Sensors_Init_Pos();
    }
    Sensors_Init_Pos() {
      this.Door_Finished_Opening_Sensor = new Sensor();
      this.Door_Finished_Closing_Sensor  = new Sensor();
      this.forces.Add_To_Propagation_List(this.Door_Finished_Opening_Sensor)
      this.forces.Add_To_Propagation_List(this.Door_Finished_Closing_Sensor)
      
      World.addEntity(this.Door_Finished_Opening_Sensor)
      World.addEntity(this.Door_Finished_Closing_Sensor)
      
      let Finished_Opening_X
      let Finished_Opening_Y;
      
      let Finished_Closing_X;
      let Finished_Closing_Y;
      switch(this.Which_Direction_The_Door_Slides_When_Opening) {
        case "left":
          Finished_Opening_X = this.getX() - this.getWidth()
          Finished_Opening_Y = this.getY();
          Finished_Closing_X = this.getX() + this.getWidth()
          Finished_Closing_Y = this.getY();
        break;
        case "right":
          Finished_Opening_X = this.getX() + (this.getWidth() * 2);
          Finished_Opening_Y = this.getY();
          Finished_Closing_X = this.getX();
          Finished_Closing_Y = this.getY();
        break;
        case "up":
         Finished_Opening_X = this.getX();
          Finished_Opening_Y = this.getY() - this.getHeight();
          Finished_Closing_X = this.getX();
          Finished_Closing_Y = this.getY() + this.getHeight();
        break;
        case "down":
          Finished_Opening_X = this.getX();
          Finished_Opening_Y = this.getY() + (this.getHeight() * 2);
          Finished_Closing_X = this.getX();
          Finished_Closing_Y = this.getY();
        break;
      }
      this.Door_Finished_Opening_Sensor.setX(Finished_Opening_X);
      this.Door_Finished_Opening_Sensor.setY(Finished_Opening_Y);
      
      this.Door_Finished_Closing_Sensor.setX(Finished_Closing_X)
      this.Door_Finished_Closing_Sensor.setY(Finished_Closing_Y)
    }
    constructor(Sliding_Open_Direction) {
        super();
        this.forces.Sliding_Key = `Sliding`;
        this.forces.Init_A_Key_For_Each_Force(this.forces.Sliding_Key);

        if (!this.Possible_Sliding_Open_Directions.includes(Sliding_Open_Direction)) {
            throw new Error(`Invalid opening direction "${Sliding_Open_Direction}". `);
        }
        this.Which_Direction_The_Door_Slides_When_Opening = Sliding_Open_Direction;
    }
    updateState() {
        super.updateState();
    }
    getState() {
        return this.state;
    }
    setState(state) {
        if (!this.possibleStates.includes(state)) {
            throw new Error(`Invalid state ${state} given`);
        }
        this.state = state;
    }
    open() {
        
    }
    close() {

    }
}