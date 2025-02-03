import {Collision_Stuff} from "./Collision_Stuff.js"

const res = Collision_Stuff.getSubPositions({x:50,y:50}, {x:0,y:0}, {x:100,y:0}, {x:500,y:4})

console.log(res.entityA)
console.log(res.entityB)
console.log(res.entityB.length)
console.log(res.entityA.length)
console.log({st:res.entityA[0], ed:res.entityA[res.entityA.length - 2]})
console.log({st:res.entityB[0], ed:res.entityB[res.entityB.length - 2]})
