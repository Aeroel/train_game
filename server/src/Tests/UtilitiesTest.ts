import {
  
  ceilERN,
  floorERN,
  closestERN,

} from "#root/Utilities/Numerical.js";
export function UtilitiesTest() {
  console.log("Testing utilities:")
  NumericalUtilitiesTest();
}
function NumericalUtilitiesTest() {
  console.log("Testing Numerical Utilities:")
const numsToTest =  [
  0.18182,
  0.4837182,
  1818.28181,
  11717,
  988,
  1.9483,
  1.37223
  ]
  const lvls=[1,2,3,4,5,6,7]
  numsToTest.forEach(num =>{
    lvls.forEach(lvl=>{
      console.log(`
      ceilERN(num ${num} lvl ${lvl}: ${ceilERN(num, lvl)}
      `)
    })
  })
  
}