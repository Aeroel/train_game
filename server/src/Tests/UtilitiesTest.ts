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
  988
  ]
  numsToTest.forEach(num =>{
    console.log(`Num: ${num}:
    ceilERN: ${ceilERN(num)},
    closestERN:
    ${closestERN(num)},
    floorERN:
    ${floorERN(num)},
    `)
  })
  
}