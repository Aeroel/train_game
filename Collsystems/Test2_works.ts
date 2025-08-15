/*

notes:
difference between test2 and test3 is that by test cases logic of prompt, test3.test4 consumes some number of velocity of so players ends ay 99860 instead of 100000. in the other file test3.ts I changed it to 100000 because I though about this and it made more sense.
note2 after sending the prompt, gpt instantly gave faied code with failed tests. I sent second message saying "tests failed [copynof tests output]". it then rhought for few minutes it gave this workijg code below.
prompt:
Implement in TypeScript a collision system between player entity and wall entity such that:
1. If player moves (in a straight line or diagonally, which has same cost, so diagonal is faster in getting from point xy to another xy) and wall standing and they will collie, player stops just outside the wall but slides if can. 
2. If player and wall move at each other (say, diagonally), wall is always allowed to complete its full movement (in other words it has no collision applied to it), while player is pushed by the wall.
3. If player is standing and wall moves at it (say, wall has straight xaxis movement or diagonal downright movement), push player.
4. Both standing still. Nothing happens.
This should work as specified whether either entity has 0 vel or 1000000 vel
Tests (coordinate system starts at top left):
1. Standing wall, moving player 
Initial Player x 0, y 0, vx 100, vy 0 width 10, height 10
Initial Wall x 50, y0 vx0 vy 0 width 10 height 10
Wanted player x 40 y 0  
Wanted Wall: Wall x 50, y 0
Test 2. Moving wall, standing player
Initial Player x 0, y 0, vx 0, vy 0 width 10, height 10
Initial Wall x -100, y0 vx500 vy 0 width 10 height 10
Wanted player x 410 y 0 
Wanted Wall: Wall x 400, y0
Test 3. Both entities move towards each other
 Initial Player x 100, y 0, vx -100, vy 0 width 10, height 10
Initial Wall x 50, y0 vx 100  vy 0 width 10 height 10
Wanted player x 160 y 
Wanted Wall: Wall x 150, y0
Test 4. High velocity diagonal movement
 Initial Player x 0, y 0, vx 100000, vy 100000 width 10, height 10
Initial Wall x 150, y150 vx 0  vy 0 width 10 height 10
Wanted player x 99860 y 140 
Wanted Wall: Wall x 150, y150

Test 5. High velocity diagonal movement + two walls
  Initial Player x 0, y 0, vx 100000, vy 100000 width 10, height 10
 Initial Wall x 150, y150 vx 0 vy 0 width 10 height 10
Wall2: x 5000 y 140, wh 10 
Wanted player x 4990 y 140 
 Wanted Wall:  x 150, y150
Wanted wall2 5000, 140
Wanted wall2

Include the tests.

*/



// below gpt response

// Collision system that matches the specified rules and the 5 tests
// Coordinate system: top-left origin; rectangles are axis-aligned, given by top-left (x,y) and width/height.
// Semantics implemented:
// 1) Player vs standing wall: swept collision; on hit, stop just outside and slide along the free axis using "remaining distance" (not remaining time).
// 2) Moving wall vs player (player may also be moving): wall always completes its full motion; if it sweeps into the player, it *pushes* the player by the wall's remaining displacement at first contact. Player's own motion is skipped for that tick if any wall pushed them.
// 3) Standing player, moving wall: same as (2), player gets pushed.
// 4) Both still: nothing happens.
// Works for velocities from 0 to very large (uses swept tests). Includes the 5 tests.

// ---------- Types ----------

type Entity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
};

const EPS = 1e-9;

// ---------- Swept collision helpers ----------

/**
 * Sweeps a moving AABB (position pos, size w/h, delta dx/dy for this tick) against a static AABB `wall`.
 * Returns the earliest hit time t in [0,1] and the hit normal (nx, ny), or null if no hit.
 * Carefully handles zero-delta on an axis: requires initial overlap on that axis to allow collision along the other.
 */
function sweepVsRect(
  posx: number,
  posy: number,
  w: number,
  h: number,
  dx: number,
  dy: number,
  wall: Entity
): { t: number; nx: number; ny: number } | null {
  let txEntry: number, txExit: number;
  let tyEntry: number, tyExit: number;

  if (Math.abs(dx) < EPS) {
    // No motion in X: must already overlap in X to have any collision gated by Y
    if (posx + w <= wall.x || posx >= wall.x + wall.width) {
      txEntry = Infinity;
      txExit = -Infinity;
    } else {
      txEntry = -Infinity;
      txExit = Infinity;
    }
  } else if (dx > 0) {
    txEntry = (wall.x - (posx + w)) / dx;
    txExit = (wall.x + wall.width - posx) / dx;
  } else {
    txEntry = (wall.x + wall.width - posx) / dx;
    txExit = (wall.x - (posx + w)) / dx;
  }

  if (Math.abs(dy) < EPS) {
    // No motion in Y: must already overlap in Y to have any collision gated by X
    if (posy + h <= wall.y || posy >= wall.y + wall.height) {
      tyEntry = Infinity;
      tyExit = -Infinity;
    } else {
      tyEntry = -Infinity;
      tyExit = Infinity;
    }
  } else if (dy > 0) {
    tyEntry = (wall.y - (posy + h)) / dy;
    tyExit = (wall.y + wall.height - posy) / dy;
  } else {
    tyEntry = (wall.y + wall.height - posy) / dy;
    tyExit = (wall.y - (posy + h)) / dy;
  }

  const tEntry = Math.max(txEntry, tyEntry);
  const tExit = Math.min(txExit, tyExit);

  if (!(tEntry >= 0 && tEntry <= 1 && tEntry <= tExit)) return null;

  // Resolve normal: the axis with the later entry time is the impact axis
  if (txEntry > tyEntry) {
    const nx = dx > 0 ? -1 : 1;
    return { t: tEntry, nx, ny: 0 };
  } else {
    const ny = dy > 0 ? -1 : 1;
    return { t: tEntry, nx: 0, ny };
  }
}

/** Move the player by (dx,dy) against a set of *static* walls, using slide with "remaining distance" semantics. */
function moveWithSlideAgainstStatics(
  player: Entity,
  dx: number,
  dy: number,
  staticWalls: Entity[]
): void {
  let px = player.x;
  let py = player.y;
  let rdx = dx;
  let rdy = dy;

  for (let it = 0; it < 16; it++) {
    let bestT = Infinity;
    let bestNX = 0;
    let bestNY = 0;
    let hitWall: Entity | null = null;

    for (const w of staticWalls) {
      const hit = sweepVsRect(px, py, player.width, player.height, rdx, rdy, w);
      if (hit && hit.t < bestT) {
        bestT = hit.t;
        bestNX = hit.nx;
        bestNY = hit.ny;
        hitWall = w;
      }
    }

    if (!hitWall) {
      // No collision, apply all remaining
      px += rdx;
      py += rdy;
      rdx = 0;
      rdy = 0;
      break;
    }

    // Resolve. We do NOT add the pre-collision displacement on the tangent axis.
    // Instead, we:
    //  - snap the impacted axis to the blocking boundary
    //  - zero that axis's remaining movement
    //  - keep only the *remaining distance* on the tangent axis: v = v - v*t
    if (bestNX !== 0) {
      if (rdx > 0) px = (hitWall as Entity).x - player.width; else px = (hitWall as Entity).x + (hitWall as Entity).width;
      rdy = rdy - rdy * Math.max(0, bestT);
      rdx = 0;
    } else {
      if (rdy > 0) py = (hitWall as Entity).y - player.height; else py = (hitWall as Entity).y + (hitWall as Entity).height;
      rdx = rdx - rdx * Math.max(0, bestT);
      rdy = 0;
    }
  }

  player.x = px;
  player.y = py;
}

// ---------- Moving wall push phase ----------

/**
 * Apply moving walls: each wall moves fully by (vx,vy). If its sweep hits the player, the player is pushed by the wall's
 * remaining displacement at first contact, sliding against *static* walls. Returns true if the player was pushed by any wall.
 */
function applyMovingWallPushes(player: Entity, walls: Entity[]): boolean {
  let pushed = false;
  for (const wall of walls) {
    const dxw = wall.vx;
    const dyw = wall.vy;
    const isMoving = Math.abs(dxw) > EPS || Math.abs(dyw) > EPS;

    if (isMoving) {
      // Sweep the wall against the current player position (player treated as static for priority rules)
      const hit = sweepVsRect(wall.x, wall.y, wall.width, wall.height, dxw, dyw, player);
      if (hit) {
        const remaining = 1 - Math.max(0, hit.t);
        const pushX = dxw * remaining;
        const pushY = dyw * remaining;
        // Static walls are those with zero velocity (including the moving one is fine; it won't block itself)
        const staticWalls = walls.filter(w => Math.abs(w.vx) < EPS && Math.abs(w.vy) < EPS);
        moveWithSlideAgainstStatics(player, pushX, pushY, staticWalls);
        pushed = true;
      }
    }

    // Wall completes its full movement regardless
    wall.x += dxw;
    wall.y += dyw;
  }
  return pushed;
}

// ---------- One simulation step ----------

function step(player: Entity, walls: Entity[]): void {
  const pushed = applyMovingWallPushes(player, walls);
  if (!pushed) {
    // Player's own movement against all walls now treated as static blockers
    moveWithSlideAgainstStatics(player, player.vx, player.vy, walls);
  } else {
    // If any wall pushed the player this frame, their own planned movement is effectively eaten by the interaction.
    // This matches the provided expectations (see Test 3).
  }
}

// ---------- Tests ----------

function approx(a: number, b: number, tol = 1e-6): boolean { return Math.abs(a - b) <= tol; }

function logTest(
  name: string,
  player: Entity,
  walls: Entity[],
  wantPX: number,
  wantPY: number,
  wantW0X: number,
  wantW0Y: number,
  wantW1X?: number,
  wantW1Y?: number
) {
  step(player, walls);
  const ok = approx(player.x, wantPX) && approx(player.y, wantPY)
          && approx(walls[0].x, wantW0X) && approx(walls[0].y, wantW0Y)
          && (wantW1X === undefined || (approx((walls[1] as Entity).x, wantW1X) && approx((walls[1] as Entity).y, wantW1Y as number)));
  const res = ok ? "PASS" : "FAIL";
  const tail = wantW1X === undefined ? "" : ` | Wall2=(${(walls[1] as Entity).x}, ${(walls[1] as Entity).y})`;
  console.log(`${name} ${res} -> Player=(${player.x}, ${player.y}) | Wall=(${walls[0].x}, ${walls[0].y})${tail}`);
}

(function runTests() {
  // Test 1. Standing wall, moving player
  // Initial Player x 0, y 0, vx 100, vy 0 width 10, height 10
  // Initial Wall  x 50, y 0  vx 0 vy 0 width 10 height 10
  // Wanted player x 40 y 0 | Wanted Wall x 50 y 0
  logTest(
    "Test 1",
    { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 },
    [{ x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 }],
    40, 0, 50, 0
  );

  // Test 2. Moving wall, standing player
  // Initial Player x 0, y 0, vx 0, vy 0 width 10, height 10
  // Initial Wall  x -100, y 0  vx 500 vy 0 width 10 height 10
  // Wanted player x 410 y 0 | Wanted Wall x 400 y 0
  logTest(
    "Test 2",
    { x: 0, y: 0, vx: 0, vy: 0, width: 10, height: 10 },
    [{ x: -100, y: 0, vx: 500, vy: 0, width: 10, height: 10 }],
    410, 0, 400, 0
  );

  // Test 3. Both entities move towards each other
  // Initial Player x 100, y 0, vx -100, vy 0 width 10, height 10
  // Initial Wall  x 50, y 0  vx 100 vy 0 width 10 height 10
  // Wanted player x 160 y 0 | Wanted Wall x 150 y 0
  logTest(
    "Test 3",
    { x: 100, y: 0, vx: -100, vy: 0, width: 10, height: 10 },
    [{ x: 50, y: 0, vx: 100, vy: 0, width: 10, height: 10 }],
    160, 0, 150, 0
  );

  // Test 4. High velocity diagonal movement
  // Initial Player x 0, y 0, vx 100000, vy 100000 width 10, height 10
  // Initial Wall  x 150, y 150  vx 0 vy 0 width 10 height 10
  // Wanted player x 99860 y 140 | Wanted Wall x 150 y 150
  logTest(
    "Test 4",
    { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
    [{ x: 150, y: 150, vx: 0, vy: 0, width: 10, height: 10 }],
    99860, 140, 150, 150
  );

  // Test 5. High velocity diagonal movement + two walls
  // Initial Player x 0, y 0, vx 100000, vy 100000 width 10, height 10
  // Initial Walls: (150,150, 10x10, static) and (5000,140, 10x10, static)
  // Wanted player x 4990 y 140 | Wanted Wall1 x 150 y 150 | Wanted Wall2 x 5000 y 140
  logTest(
    "Test 5",
    { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
    [
      { x: 150, y: 150, vx: 0, vy: 0, width: 10, height: 10 },
      { x: 5000, y: 140, vx: 0, vy: 0, width: 10, height: 10 }
    ],
    4990, 140, 150, 150, 5000, 140
  );
})();
