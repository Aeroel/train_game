import {
mySweep,
} from "#root/Collision_Stuff/Collision_Checking_Methods/Sweep/Sweep.js";
import colors  from "colors"
import { My_Assert} from "#root/My_Assert.js"
import type {
  Box_With_Velocity,
} from "#root/Type_Stuff.js";

export function SweptTest() {
Swapping_Order_Of_Entities_Passed_Does_Not_Change_Collision_Time_Test();
High_Velocity_No_Tunneling_Test();

}
function Swapping_Order_Of_Entities_Passed_Does_Not_Change_Collision_Time_Test() {
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
  width:1600,
  height:1600,
  vx: 0,
  vy: 0
}
console.log('a:', a);
console.log('b:', b);
const s1 =mySweep(a,b,dt)
const s2 =mySweep(b,a,dt)

My_Assert.that(s1 !== null,"s1 null")
My_Assert.that(s2 !== null, "s2 null")
const time1= s1.time;
const time2= s2.time;
console.log(`Ab:${time1}`)
console.log(`ba:${time2}`)
console.log(`ABn:${JSON.stringify(s1.normal)}`)
console.log(`BAn:${JSON.stringify(s2.normal)}`)
console.log("Testing collision time when I do sweep(a,b) and then sweep(b,a), collision time must be equivalent")
My_Assert.that(time1===time2, "Swept a,b.time = swept b,a.time assertion failure")
console.log("Sweep time equivalency passed, yay!".green)
}

function High_Velocity_No_Tunneling_Test() {
    const dt = 25;
  const a = <Box_With_Velocity>{
  x: 0,
  y: 0,
  width:8,
  height:8,
  vx: 100,
  vy: 100,
}
const b = <Box_With_Velocity>{
  x: 50,
  y: 50,
  width:1,
  height:16000000,
  vx: 0,
  vy: 0
}

const collision = mySweep(a,b,dt)
const collisionSwapped = mySweep(b,a,dt)

console.log(collision)
console.log(collisionSwapped)
My_Assert.that(collision !== null, "High velocity test failed")
My_Assert.that(collisionSwapped !== null, "High velocity swapped collision test failed")
console.log("high velocity test passed".green)
}