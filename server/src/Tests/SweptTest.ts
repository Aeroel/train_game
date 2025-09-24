import {
mySweep
} from "#root/Collision_Stuff/Collision_Checking_Methods/Sweep.js";
import type {
  Direction,
  Position,
  Collision_Time_And_Normal,
  Simplified_Enity,
  Collision_Info,
  Normal,
  Box_With_Velocity,
  Box
} from "#root/Type_Stuff.js";

const dt = 50;
const a = <Box_With_Velocity>{
  x: 0,
  y: 0,
  width:10,
  height:10,
  vx: 1,
  vy: 1
}
const b = <Box_With_Velocity>{
  x: 20,
  y: 20,
  width:10,
  height:10,
  vx: 1,
  vy: 1
}
console.log(mySweep(a,b,dt))