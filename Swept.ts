type Swept_Result = null | {
  time: number;
  normal: {
    x: number,
    y: number
  }
}


// dt is used for creating the expanded box
function mySwept(a: Box_With_Velocity, b: Box_With_Velocity, deltaTime: number): Swept_Result {

  let result: Swept_Result = {
    time: 0,
    normal: {
      x: 0,
      y: 0
    }};
  if (overlap(a, b)) {
    result = {
      time: 0,
      normal: {
        x: 0,
        y: 0
      }}
    return result;
  }
  const relx = a.vx - b.vx;
  const rely = a.vy - b.vy;
  // collision impossible if no overlap and no relative velocity
  if (relx === 0 && rely === 0) {
    result = null
    return null
  }
  const expA = expandByVel(a, relx, rely, deltaTime)
  if (!overlap(expA, b)) {
    return null
  }

  let xTime0: number = 0;
  let xTime100: number = 0;
  let xOverlapStartPercent = -Infinity
  let xOverlapEndPercent = Infinity
  let xOverlapStartPoint: number = 0;
  let xOverlapEndPoint: number = 0;
  if (relx < 0) {
    xTime0 = expA.x + expA.width;
    xTime100 = expA.x
    xOverlapStartPoint = b.x + b.width+ a.width;
    xOverlapEndPoint = b.x - a.width;

  }
  if (relx > 0) {
    xTime0 = expA.x;
    xTime100 = expA.x + expA.width
    xOverlapStartPoint = b.x - a.width;
    xOverlapEndPoint = b.x + b.width + a.width;
  }
  if (relx !== 0) {
    xOverlapStartPercent = percentOf(xOverlapStartPoint, xTime0, xTime100)
    xOverlapEndPercent = percentOf(xOverlapEndPoint, xTime0, xTime100)

  }

  let yTime0: number = 0;
  let yTime100: number = 0;
  let yOverlapStartPercent = -Infinity;
  let yOverlapEndPercent = Infinity;
  let yOverlapStartPoint: number = 0;
  let yOverlapEndPoint: number = 0;
  if (rely > 0) {
    yTime0 = expA.y;
    yTime100 = expA.y + expA.height
    yOverlapStartPoint = b.y - a.height;
    yOverlapEndPoint = b.y + b.height + a.height;
  }
  if (rely < 0) {
    yTime0 = expA.y + expA.height;
    yTime100 = expA.y
    yOverlapStartPoint = b.y + b.height + a.height;
    yOverlapEndPoint = b.y - a.height;
  }
  if (rely !== 0) {
    yOverlapStartPercent = percentOf(yOverlapStartPoint, yTime0, yTime100)
    yOverlapEndPercent = percentOf(yOverlapEndPoint, yTime0, yTime100)
  }

  const overlapStartPercent = Math.max(xOverlapStartPercent, yOverlapStartPercent)
  const overlapEndPercent = Math.min(xOverlapEndPercent, yOverlapEndPercent);
  if (overlapStartPercent > overlapEndPercent) {
    return null;
  }
  const overlapStartNormalizedTime = overlapStartPercent / 100;
  const normal = preferXIfDiagonal(calculateNormal(xOverlapStartPercent, yOverlapStartPercent, relx, rely));
  return {
    time: overlapStartNormalizedTime,
    normal
  };

}
function percentOf(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}
function overlap(a: Box, b: Box) {

  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}
function expandByVel(entity: Box, vx: number, vy: number, deltaTime: number): Box {
  const ex = {
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
  };

  if (vx > 0) {
    ex.width += vx * deltaTime;
  } else {
    ex.x += vx * deltaTime;
    ex.width += -vx * deltaTime;
  }

  if (vy > 0) {
    ex.height += vy * deltaTime;
  } else {
    ex.y += vy * deltaTime;
    ex.height += -vy * deltaTime;
  }

  return ex;
}
function calculateNormal(xOverlapStartPercent: number, yOverlapStartPercent: number, relx: number, rely: number) {
  const normal: Normal = {
    x: 0,
    y: 0
  };

  if (xOverlapStartPercent > yOverlapStartPercent) {
    // collision happened along X axis
    if (relx > 0) {
      normal.x = -1; // moving right, hit left side of b
    } else {
      normal.x = 1; // moving left, hit right side of b
    }
  } else {
    // collision happened along Y axis
    if (rely > 0) {
      normal.y = -1; // moving down, hit top of b
    } else {
      normal.y = 1; // moving up, hit bottom of b
    }
  }

  return normal;
}
function preferXIfDiagonal(normal: Normal) {

  if (normal.x !== 0 && normal.y !== 0) {
    console.log("diagonal normal")
    return {
      ...normal,
      y: 0,
    }
  }
  return normal;
}