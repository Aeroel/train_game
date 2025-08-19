/*
note: after sending the prompt, gpt instantly gave faied code with failed tests. I sent second message saying "tests failed [copynof tests output]". it then rhought for few minutes it gave this workijg code below.

prompt {
  
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
Wanted player x 100000 y 140 
Wanted Wall: Wall x 150, y150

Test 5. High velocity diagonal movement + two walls
  Initial Player x 0, y 0, vx 100000, vy 100000 width 10, height 10
 Initial Wall x 140, y140 vx -10 vy -10 width 10 height 10
Wall2: x 5000 y 140, vx 0 vy 0 wh 10 
Wanted player x 4990 y 140 
 Wanted Wall:  x 150, y150
Wanted wall2 5000, 140
Wanted wall2

Include the tests.
}
*/


type Entity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
};

type Hit = {
  hit: boolean;
  t: number;        // time of impact within [0, dt]
  nx: number;       // collision normal x (axis-aligned: -1, 0, or 1)
  ny: number;       // collision normal y (axis-aligned: -1, 0, or 1)
};

const EPS = 1e-7;

function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

function rectsOverlap(a: Entity, b: Entity): boolean {
  return !(
    a.x + a.width <= b.x ||
    a.x >= b.x + b.width ||
    a.y + a.height <= b.y ||
    a.y >= b.y + b.height
  );
}

/**
 * Swept AABB between a moving rect (with RELATIVE velocity vRel) and a static rect.
 * moving, target are positions at the CURRENT time.
 * dt is the remaining time window (1 frame = 1).
 */
function sweptAABB(
  moving: Entity,
  target: Entity,
  vRelX: number,
  vRelY: number,
  dt: number
): Hit {
  // If already overlapping, treat as immediate hit at t=0.
  if (rectsOverlap(moving, target)) {
    // Choose the smaller penetration axis as the collision normal.
    const dxLeft = (moving.x + moving.width) - target.x;
    const dxRight = (target.x + target.width) - moving.x;
    const dyTop = (moving.y + moving.height) - target.y;
    const dyBottom = (target.y + target.height) - moving.y;
    const minX = Math.min(dxLeft, dxRight);
    const minY = Math.min(dyTop, dyBottom);

    if (minX < minY) {
      return { hit: true, t: 0, nx: dxLeft < dxRight ? -1 : 1, ny: 0 };
    } else {
      return { hit: true, t: 0, nx: 0, ny: dyTop < dyBottom ? -1 : 1 };
    }
  }

  // Compute entry/exit times for X
  let txEntry: number, txExit: number;
  if (Math.abs(vRelX) < EPS) {
    // No relative motion on X; if separated on X, they will never meet via X.
    if (moving.x + moving.width <= target.x || moving.x >= target.x + target.width) {
      return { hit: false, t: Infinity, nx: 0, ny: 0 };
    }
    txEntry = -Infinity;
    txExit = Infinity;
  } else {
    const xInvEntry = vRelX > 0
      ? target.x - (moving.x + moving.width)
      : (target.x + target.width) - moving.x;
    const xInvExit = vRelX > 0
      ? (target.x + target.width) - moving.x
      : target.x - (moving.x + moving.width);

    txEntry = xInvEntry / vRelX;
    txExit = xInvExit / vRelX;
  }

  // Compute entry/exit times for Y
  let tyEntry: number, tyExit: number;
  if (Math.abs(vRelY) < EPS) {
    if (moving.y + moving.height <= target.y || moving.y >= target.y + target.height) {
      return { hit: false, t: Infinity, nx: 0, ny: 0 };
    }
    tyEntry = -Infinity;
    tyExit = Infinity;
  } else {
    const yInvEntry = vRelY > 0
      ? target.y - (moving.y + moving.height)
      : (target.y + target.height) - moving.y;
    const yInvExit = vRelY > 0
      ? (target.y + target.height) - moving.y
      : target.y - (moving.y + moving.height);

    tyEntry = yInvEntry / vRelY;
    tyExit = yInvExit / vRelY;
  }

  const tEntry = Math.max(txEntry, tyEntry);
  const tExit = Math.min(txExit, tyExit);

  if (tEntry > tExit || tExit < 0 || tEntry > dt) {
    return { hit: false, t: Infinity, nx: 0, ny: 0 };
  }

  // Determine normal by dominant axis at entry time.
  // Break ties preferring Y so diagonal hits block vertical first (matches your Test 4).
  let nx = 0, ny = 0;
  if (txEntry > tyEntry) {
    nx = vRelX > 0 ? -1 : 1;
  } else {
    ny = vRelY > 0 ? -1 : 1;
  }

  const tHit = Math.max(0, tEntry);
  return { hit: true, t: tHit, nx, ny };
}

/**
 * Simulate one frame (dt=1) for player vs an array of walls.
 * Walls move freely; player is resolved continuously and slides.
 */
function resolvePlayerVsWalls(
  playerIn: Entity,
  wallsIn: Entity[]
): { player: Entity; walls: Entity[] } {
  const player = clone(playerIn);
  const walls = wallsIn.map(clone);

  // We'll treat time in [0,1]
  let tNow = 0;
  let remain = 1;

  // Player velocity per frame (constant between collisions, but we will modify it on hits).
  let vpX = player.vx;
  let vpY = player.vy;

  // Precompute wall velocities and initial positions
  const wInit = walls.map(w => ({ x: w.x, y: w.y, vx: w.vx, vy: w.vy, width: w.width, height: w.height }));

  // Iterate through collisions within the frame
  for (let iter = 0; iter < 16 && remain > EPS; iter++) {
    // Find earliest collision among walls
    let best: {
      wallIndex: number;
      t: number;
      nx: number;
      ny: number;
    } | null = null;

    for (let i = 0; i < wInit.length; i++) {
      const w = wInit[i];

      // Wall position at current time
      const wx = w.x + w.vx * tNow;
      const wy = w.y + w.vy * tNow;

      const wallSnapshot: Entity = { x: wx, y: wy, vx: 0, vy: 0, width: w.width, height: w.height };

      // Relative velocity over real time
      const vRelX = vpX - w.vx;
      const vRelY = vpY - w.vy;

      const hit = sweptAABB(
        { x: player.x, y: player.y, vx: 0, vy: 0, width: player.width, height: player.height },
        wallSnapshot,
        vRelX,
        vRelY,
        remain
      );

      if (hit.hit) {
        if (!best || hit.t < best.t) {
          best = { wallIndex: i, t: hit.t, nx: hit.nx, ny: hit.ny };
        }
      }
    }

    if (!best) {
      // No collision in remaining time; advance player and finish
      player.x += vpX * remain;
      player.y += vpY * remain;
      tNow += remain;
      remain = 0;
      break;
    }

    // Advance to collision time
    player.x += vpX * best.t;
    player.y += vpY * best.t;
    tNow += best.t;
    remain -= best.t;

    // Place player just outside the wall at collision moment to avoid overlap
    const w = wInit[best.wallIndex];
    const wxAtHit = w.x + w.vx * tNow;
    const wyAtHit = w.y + w.vy * tNow;

    if (best.nx !== 0) {
      // Collided along X
      if (best.nx === -1) {
        // Player came from left moving right relative to wall
        player.x = wxAtHit - player.width - EPS;
      } else {
        // Player came from right moving left relative to wall
        player.x = wxAtHit + w.width + EPS;
      }
      // Zero relative motion on X => player X velocity becomes wall's X velocity
      vpX = w.vx;
      // Y velocity unchanged (sliding)
    } else if (best.ny !== 0) {
      // Collided along Y
      if (best.ny === -1) {
        // Player came from above
        player.y = wyAtHit - player.height - EPS;
      } else {
        // Player came from below
        player.y = wyAtHit + w.height + EPS;
      }
      // Zero relative motion on Y => player Y velocity becomes wall's Y velocity
      vpY = w.vy;
      // X velocity unchanged (sliding)
    } else {
      // Shouldn't happen, but let's bail safely
      break;
    }

    // Continue loop for remaining time; velocities updated already
  }

  // Final wall positions: they always complete their move
  const wallsFinal = walls.map((w, i) => ({
    ...w,
    x: wInit[i].x + wInit[i].vx,
    y: wInit[i].y + wInit[i].vy
  }));

  return { player, walls: wallsFinal };
}

/* =========================
   TESTS
   ========================= */

function assertClose(actual: number, expected: number, label: string, eps = 1e-4) {
  if (Math.abs(actual - expected) > eps) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function runTest(
  name: string,
  player: Entity,
  walls: Entity[],
  expectedPlayer: { x: number; y: number },
  expectedWalls: { x: number; y: number }[]
) {
  const { player: p, walls: ws } = resolvePlayerVsWalls(player, walls);
  console.log(name, "=> Player", { x: p.x, y: p.y }, "Walls", ws.map(w => ({ x: w.x, y: w.y })));

  assertClose(p.x, expectedPlayer.x, `${name} player.x`);
  assertClose(p.y, expectedPlayer.y, `${name} player.y`);

  for (let i = 0; i < expectedWalls.length; i++) {
    assertClose(ws[i].x, expectedWalls[i].x, `${name} wall${i + 1}.x`);
    assertClose(ws[i].y, expectedWalls[i].y, `${name} wall${i + 1}.y`);
  }
}

// Test 1. Standing wall, moving player
runTest(
  "Test 1",
  { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 },
  [{ x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 }],
  { x: 40, y: 0 },
  [{ x: 50, y: 0 }]
);

// Test 2. Moving wall, standing player
runTest(
  "Test 2",
  { x: 0, y: 0, vx: 0, vy: 0, width: 10, height: 10 },
  [{ x: -100, y: 0, vx: 500, vy: 0, width: 10, height: 10 }],
  { x: 410, y: 0 },
  [{ x: 400, y: 0 }]
);

// Test 3. Both move towards each other
runTest(
  "Test 3",
  { x: 100, y: 0, vx: -100, vy: 0, width: 10, height: 10 },
  [{ x: 50, y: 0, vx: 100, vy: 0, width: 10, height: 10 }],
  { x: 160, y: 0 },
  [{ x: 150, y: 0 }]
);

// Test 4. High velocity diagonal movement
runTest(
  "Test 4",
  { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
  [{ x: 150, y: 150, vx: 0, vy: 0, width: 10, height: 10 }],
  { x: 100000, y: 140 },
  [{ x: 150, y: 150 }]
);

// Test 5. High velocity diagonal + two walls
// NOTE: Fixed your sign to match your expected final wall position.
runTest(
  "Test 5",
  { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
  [
    { x: 140, y: 140, vx: 10, vy: 10, width: 10, height: 10 },      // fixed (+10, +10)
    { x: 5000, y: 140, vx: 0, vy: 0, width: 10, height: 10 }
  ],
  { x: 4990, y: 140 },
  [
    { x: 150, y: 150 }, // wall 1
    { x: 5000, y: 140 } // wall 2
  ]
);

console.log("All tests passed.");
