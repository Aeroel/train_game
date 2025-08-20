import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sensor } from "#root/Entities/Sensor.js"
import { World } from "#root/World.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Entity_Velocity } from "#root/Entities/Entity_Velocity.js"
import {Helper_Functions } from "#root/Helper_Functions.js"

export { Sliding_Door };

type Door_Sliding_Open_Direction = 
  "up" |"down" |"left" | "right"
type Door_Sliding_Closed_Direction = Door_Sliding_Open_Direction;
type Door_State = "closed" | "closing" |"opened" | "opening";

class Sliding_Door extends Base_Entity {
  static readonly Possible_Sliding_Open_Directions = ["up", "down", "left", "right"];
  static readonly Possible_Sliding_Closed_Directions = Sliding_Door.Possible_Sliding_Open_Directions;
  static readonly Possible_States = ["closed", "closing", "opened", "opening"];

  color = "blue";
  state = 'closed';
  Which_Direction_The_Door_Slides_When_Opening: Door_Sliding_Open_Direction;
  Which_Direction_The_Door_Slides_When_Closing: Door_Sliding_Closed_Direction;
  sensors = {
    Door_Finished_Opening_Sensor: new Sensor(),
    Door_Finished_Closing_Sensor: new Sensor()

  };
  Door_Sliding_Speed = 0.01;
  Sliding_Key = `Sliding_Door_${this.id}`;
  setXYWH(x: number, y: number, w: number, h: number) {
    super.setXYWH(x, y, w, h);
    this.Sensors_Init_Pos();
    return this;
  }
  Sensors_Init_Pos() {
    World.addEntity(this.sensors.Door_Finished_Opening_Sensor)
    World.addEntity(this.sensors.Door_Finished_Closing_Sensor)

    let Finished_Opening_X: number;
    let Finished_Opening_Y: number;

    let Finished_Closing_X: number;
    let Finished_Closing_Y: number;
    switch (this.Which_Direction_The_Door_Slides_When_Opening) {
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
      default:
        throw new Error("Invalid direction ${}");
      break;
    }
    this.sensors.Door_Finished_Opening_Sensor.setX(Finished_Opening_X);
    this.sensors.Door_Finished_Opening_Sensor.setY(Finished_Opening_Y);

    this.sensors.Door_Finished_Closing_Sensor.setX(Finished_Closing_X)
    this.sensors.Door_Finished_Closing_Sensor.setY(Finished_Closing_Y)
  }
  constructor(Sliding_Open_Direction: Door_Sliding_Open_Direction) {
    super();
    this.addTag('Sliding_Door');
    this.velocity.x.Add_Component({key:this.Sliding_Key,value:0});
    this.velocity.y.Add_Component({key:this.Sliding_Key,value:0});

    if (!Sliding_Door.Possible_Sliding_Open_Directions.includes(Sliding_Open_Direction)) {
      throw new Error(`Invalid opening direction "${Sliding_Open_Direction}". `);
    }
    this.Which_Direction_The_Door_Slides_When_Opening = Sliding_Open_Direction;
    this.Which_Direction_The_Door_Slides_When_Closing = Helper_Functions.getOppositeDirection(Sliding_Open_Direction) as Door_Sliding_Closed_Direction;
  }
  updateState() {
    if (this.getState() === 'opening') {
      this.handleOpening();
    }
    else if (this.getState() === 'closing') {
      this.handleClosing();
    }


    super.updateState();
  }

  handleClosing() {
    if (!(this.getState() === 'closing')) {
      return;
    }
    const Door_Finished_Closing = Collision_Stuff.checkForCollision(this, this.sensors.Door_Finished_Closing_Sensor);
    if (Door_Finished_Closing) {
      this.Handle_Door_Finished_Closing();
      return;
    }
   this.velocity.x.Remove_Component(this.Sliding_Key);
   this.velocity.y.Remove_Component(this.Sliding_Key);

this.velocity.directionToVelocity({key:this.Sliding_Key,direction:this.Which_Direction_The_Door_Slides_When_Closing, value:this.Door_Sliding_Speed})
  

  }
  Handle_Door_Finished_Closing() {
    let neededX;
    let neededY;
    const clSensor = this.sensors.Door_Finished_Closing_Sensor;
    switch (this.Which_Direction_The_Door_Slides_When_Closing) {
      case "up":
        neededX = this.getX();
        neededY = clSensor.getY();
        break;
      case "down":
        neededX = this.getX();
        neededY = clSensor.getY() - this.getHeight();
        break;
      case "right":
        neededX = clSensor.getX() - this.getWidth();
        neededY = this.getY();
        break;
      case "left":
        neededX = clSensor.getX();
        neededY = this.getY()
        break;
    }
   this.velocity.x.Remove_Component(this.Sliding_Key)
   this.velocity.y.Remove_Component(this.Sliding_Key)
    this.setX(neededX);
    this.setY(neededY);
    this.setState("closed");
    return;
  }
  handleOpening() {
    if (!(this.getState() === 'opening')) {
      return;
    }
    const Door_Finished_Opening = Collision_Stuff.checkForCollision(this, this.sensors.Door_Finished_Opening_Sensor);
    if (Door_Finished_Opening) {
      this.Handle_Door_Finished_Opening();
      return;
    }
   this.velocity.x.Remove_Component(this.Sliding_Key);
   this.velocity.y.Remove_Component(this.Sliding_Key);
  this.velocity.directionToVelocity({key:this.Sliding_Key,direction:this.Which_Direction_The_Door_Slides_When_Opening, value:this.Door_Sliding_Speed})
  }
  Handle_Door_Finished_Opening() {
    let neededX;
    let neededY;
    const opSensor = this.sensors.Door_Finished_Opening_Sensor;
    switch (this.Which_Direction_The_Door_Slides_When_Opening) {
      case "up":
        neededX = this.getX();
        neededY = opSensor.getY();
        break;
      case "down":
        neededX = this.getX();
        neededY = opSensor.getY() - this.getHeight();
        break;
      case "right":
        neededX = opSensor.getX() - this.getWidth();
        neededY = this.getY();
        break;
      case "left":
        neededX = opSensor.getX();
        neededY = this.getY()
        break;
    }
    this.velocity.x.Remove_Component(this.Sliding_Key)
    this.velocity.y.Remove_Component(this.Sliding_Key)
    this.setX(neededX);
    this.setY(neededY);
    this.setState("opened");
    return;
  }
  getState() {
    return this.state;
  }
  setState(state: Door_State) {
    if (!Sliding_Door.Possible_States.includes(state)) {
      throw new Error(`Invalid state ${state} given`);
    }
    this.state = state;
  }
  open() {
    this.setState("opening");

  }
  close() {

    this.setState("closing");
  }
}