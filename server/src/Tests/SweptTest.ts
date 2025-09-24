import {
mySweep
} from "#root/Collision_Stuff/Collision_Checking_Methods/Sweep/Sweep.js";
import { My_Assert} from "#root/My_Assert.js"
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

export function SweptTest() {
const dt = 50;
const a = <Box_With_Velocity>{
  x: 0,
  y: 0,
  width:8,
  height:8,
  vx: 1,
  vy: 1
}
const b = <Box_With_Velocity>{
  x: 16,
  y: 16,
  width:16,
  height:16,
  vx: 0,
  vy: 0
}
console.log("Swept equal time test if I swap a and b");
const s1 =mySweep(a,b,dt)
const s2 =mySweep(b,a,dt)
My_Assert.that(s1 !== null && s2 !== null, "...")
const time1= s1.time;
const time2= s2.time;
console.log(`Ab:${time1}`)
console.log(`ba:${time2}`)
My_Assert.that(time1===time2, "Swept a,b.time = swept b,a.time assertion failure")

}