export {
  ceilERN,
  floorERN,
  closestERN,
  getPercentOfWhole,
}

// ERN = Exactly representable number. so, if given 2.777 it can (depending on level and ceil/floor/cl) give something like 2.5 or some other exactly representable binary number
function ceilERN(x: number, level: number = 7): number {
    const step = 1 / (2 ** level);
    return Math.ceil(x / step) * step;
}

function floorERN(x: number, level: number = 7): number {
    const step = 1 / (2 ** level);
    return Math.floor(x / step) * step;
}

function closestERN(x: number, level: number = 7): number {
    const step = 1 / (2 ** level);
    return Math.round(x / step) * step;
}

function getPercentOfWhole(value:number, whole: number) {
  if (whole === 0) {
        throw new Error("Whole cannot be zero");
    }
    
    // Calculate percentage and round to nearest whole number
    return Math.round((value / whole) * 100);

}