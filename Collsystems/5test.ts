type Entity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  immovable?: boolean; // walls are immovable in collisions
};

function aabbIntersect(a: Entity, b: Entity): boolean {
  return !(
    a.x + a.width <= b.x ||
    a.x >= b.x + b.width ||
    a.y + a.height <= b.y ||
    a.y >= b.y + b.height
  );
}

// Swept AABB for continuous collision detection
function sweptAABB(player: Entity, wall: Entity): {
  time: number;
  nx: number;
  ny: number;
} {
  const invEntry: { x: number; y: number } = { x: 0, y: 0 };
  const invExit: { x: number; y: number } = { x: 0, y: 0 };

  const relVx = player.vx - wall.vx;
  const relVy = player.vy - wall.vy;

  if (relVx > 0) {
    invEntry.x = wall.x - (player.x + player.width);
    invExit.x = wall.x + wall.width - player.x;
  } else {
    invEntry.x = wall.x + wall.width - player.x;
    invExit.x = wall.x - (player.x + player.width);
  }

  if (relVy > 0) {
    invEntry.y = wall.y - (player.y + player.height);
    invExit.y = wall.y + wall.height - player.y;
  } else {
    invEntry.y = wall.y + wall.height - player.y;
    invExit.y = wall.y - (player.y + player.height);
  }

  const entry: { x: number; y: number } = {
    x: relVx === 0 ? -Infinity : invEntry.x / relVx,
    y: relVy === 0 ? -Infinity : invEntry.y / relVy,
  };

  const exit: { x: number; y: number } = {
    x: relVx === 0 ? Infinity : invExit.x / relVx,
    y: relVy === 0 ? Infinity : invExit.y / relVy,
  };

  const entryTime = Math.max(Math.min(entry.x, entry.y), 0);
  const exitTime = Math.min(Math.max(exit.x, exit.y), 1);

  if (entryTime > exitTime || (entry.x < 0 && entry.y < 0) || entry.x > 1 || entry.y > 1) {
    return { time: 1, nx: 0, ny: 0 }; // no collision
  }

  let nx = 0,
    ny = 0;
  if (entry.x > entry.y) {
    nx = invEntry.x < 0 ? 1 : -1;
  } else {
    ny = invEntry.y < 0 ? 1 : -1;
  }

  return { time: entryTime, nx, ny };
}

function resolveCollision(player: Entity, walls: Entity[]): void {
  let remainingTime = 1;
  let px = player.x;
  let py = player.y;
  let vx = player.vx;
  let vy = player.vy;

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const { time, nx, ny } = sweptAABB({ ...player, x: px, y: py, vx, vy }, wall);

    if (time < remainingTime) {
      px += vx * time;
      py += vy * time;
      remainingTime -= time;

      // slide along wall
      if (nx !== 0) vx = wall.vx; // player gets pushed in wall's dir if wall moves
      if (ny !== 0) vy = wall.vy;
    }
  }

  px += vx * remainingTime;
  py += vy * remainingTime;

  player.x = Math.round(px);
  player.y = Math.round(py);
  player.vx = vx;
  player.vy = vy;
}

// TESTS
function runTests() {
  const tests = [
    {
      name: "Test 1",
      player: { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 },
      walls: [{ x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 }],
      wantP: { x: 40, y: 0 },
      wantW: [{ x: 50, y: 0 }],
    },
    {
      name: "Test 2",
      player: { x: 0, y: 0, vx: 0, vy: 0, width: 10, height: 10 },
      walls: [{ x: -100, y: 0, vx: 500, vy: 0, width: 10, height: 10 }],
      wantP: { x: 410, y: 0 },
      wantW: [{ x: 400, y: 0 }],
    },
    {
      name: "Test 3",
      player: { x: 100, y: 0, vx: -100, vy: 0, width: 10, height: 10 },
      walls: [{ x: 50, y: 0, vx: 100, vy: 0, width: 10, height: 10 }],
      wantP: { x: 160, y: 0 },
      wantW: [{ x: 150, y: 0 }],
    },
    {
      name: "Test 4",
      player: { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
      walls: [{ x: 150, y: 150, vx: 0, vy: 0, width: 10, height: 10 }],
      wantP: { x: 100000, y: 140 },
      wantW: [{ x: 150, y: 150 }],
    },
    {
      name: "Test 5",
      player: { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 },
      walls: [
        { x: 140, y: 140, vx: -10, vy: -10, width: 10, height: 10 },
        { x: 5000, y: 140, vx: 0, vy: 0, width: 10, height: 10 },
      ],
      wantP: { x: 4990, y: 140 },
      wantW: [
        { x: 150, y: 150 },
        { x: 5000, y: 140 },
      ],
    },
    {
      name: "Test 6",
      player: { x: 6, y: 5, vx: 1000, vy: 1000, width: 10, height: 10 },
      walls: [
        { x: 0, y: 0, vx: 0, vy: 0, width: 2, height: 4 },
        { x: 0, y: 0, vx: 0, vy: 0, width: 5, height: 4 },
      ],
      wantP: { x: 2, y: 2 },
      wantW: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
    },
    {
      name: "Test 7",
      player: { x: 6, y: 5, vx: 10000, vy: 10000, width: 10, height: 10 },
      walls: [
        { x: 0, y: 0, vx: 100, vy: 0, width: 2, height: 4 },
        { x: 0, y: 0, vx: 0, vy: 100, width: 5, height: 4 },
      ],
      wantP: { x: 102, y: 102 },
      wantW: [
        { x: 100, y: 0 },
        { x: 0, y: 100 },
      ],
    },
  ];

  for (const t of tests) {
    resolveCollision(t.player, t.walls);
    t.walls.forEach((w) => {
      w.x += w.vx;
      w.y += w.vy;
    });
    console.log(
      t.name,
      "Player:", t.player.x, t.player.y,
      "Expected:", t.wantP,
      "Walls:", t.walls.map((w) => ({ x: w.x, y: w.y })),
      "Want Walls:", t.wantW
    );
  }
}

runTests();
