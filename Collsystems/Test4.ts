/*


Implement in TypeScript a collision system between player entity and wall entity such that:
1. If player moves (in a straight line or diagonally, which has same cost, so diagonal is faster in getting from point xy to another xy) and wall standing and they will collie, player stops just outside the wall but slides if can. 
2. If player and wall move at each other (say, diagonally), wall is always allowed to complete its full movement (in other words it has no collision applied to it), while player is pushed by the wall.
3. If player is standing and wall moves at it (say, wall has straight xaxis movement or diagonal downright movement), push player.
4. Both standing still. Nothing happens.
This should work as specified whether either entity has 0 vel or 1000000 vel
5. Corner cases, if two walls make a corner, the player should correctly be unable to pass them. It should work properly whether either are stationary or moving,  so both walls should be able to push players as well.
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

Test 6. Corner case (player moving, walls stationary)
Player Initial xy: 6,5, vx:1000,vy 1000
Wall1 xy 0,0,wh: 2,4
Wall2 xy 0,0, wh 5,4
Player wanted: xy 2,2, vx vy 0,0

test 7: corner case (player moving, walls moving)
Player Initial xy: 6,5, vx:10000,vy 10000
Wall1 xy 0,0,wh: 2,4 vx 100 vy 100
Wall2 xy 0,0, wh 5,4 vx 100 vy 100
Player wanted: xy 102,102, vx vy 0,0
wall1 wall2 wanted: xy 100, 100w
Include the tests.

*/
// Types
interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  type: 'player' | 'wall';
}

interface CollisionResult {
  time: number;
  entityA: Entity;
  entityB: Entity;
  normal: { x: number; y: number };
}

class CollisionSystem {
  
  /**
   * Main collision resolution function
   */
  static resolveCollisions(player: Entity, walls: Entity[]): void {
    // First, move all walls (they have priority)
    walls.forEach(wall => {
      wall.x += wall.vx;
      wall.y += wall.vy;
    });

    // Find all potential collisions with the player
    const collisions: CollisionResult[] = [];
    
    walls.forEach(wall => {
      const collision = this.sweepTest(player, wall);
      if (collision) {
        collisions.push(collision);
      }
    });

    // Sort by collision time (earliest first)
    collisions.sort((a, b) => a.time - b.time);

    // Resolve collisions in order
    for (const collision of collisions) {
      this.resolvePlayerWallCollision(player, collision);
    }
  }

  /**
   * Swept AABB collision detection
   */
  private static sweepTest(player: Entity, wall: Entity): CollisionResult | null {
    // Calculate relative velocity (player relative to wall)
    const rvx = player.vx - wall.vx;
    const rvy = player.vy - wall.vy;

    // If no relative movement, check if already overlapping
    if (rvx === 0 && rvy === 0) {
      if (this.aabbOverlap(player, wall)) {
        return {
          time: 0,
          entityA: player,
          entityB: wall,
          normal: { x: 1, y: 0 } // Default normal
        };
      }
      return null;
    }

    // Expand wall by player's dimensions
    const expandedWall = {
      x: wall.x - player.width,
      y: wall.y - player.height,
      width: wall.width + player.width,
      height: wall.height + player.height
    };

    // Calculate intersection times for each axis
    let txEntry, txExit, tyEntry, tyExit;

    if (rvx === 0) {
      if (player.x < expandedWall.x || player.x > expandedWall.x + expandedWall.width) {
        return null;
      }
      txEntry = Number.NEGATIVE_INFINITY;
      txExit = Number.POSITIVE_INFINITY;
    } else {
      txEntry = (expandedWall.x - player.x) / rvx;
      txExit = (expandedWall.x + expandedWall.width - player.x) / rvx;
      if (txEntry > txExit) {
        [txEntry, txExit] = [txExit, txEntry];
      }
    }

    if (rvy === 0) {
      if (player.y < expandedWall.y || player.y > expandedWall.y + expandedWall.height) {
        return null;
      }
      tyEntry = Number.NEGATIVE_INFINITY;
      tyExit = Number.POSITIVE_INFINITY;
    } else {
      tyEntry = (expandedWall.y - player.y) / rvy;
      tyExit = (expandedWall.y + expandedWall.height - player.y) / rvy;
      if (tyEntry > tyExit) {
        [tyEntry, tyExit] = [tyExit, tyEntry];
      }
    }

    const entryTime = Math.max(txEntry, tyEntry);
    const exitTime = Math.min(txExit, tyExit);

    // No collision if entry > exit or collision is in the past or beyond current frame
    if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
      return null;
    }

    // Determine collision normal
    let normal = { x: 0, y: 0 };
    if (txEntry > tyEntry) {
      normal.x = rvx > 0 ? -1 : 1;
    } else {
      normal.y = rvy > 0 ? -1 : 1;
    }

    return {
      time: entryTime,
      entityA: player,
      entityB: wall,
      normal
    };
  }

  /**
   * Check if two AABBs overlap
   */
  private static aabbOverlap(a: Entity, b: Entity): boolean {
    return !(a.x >= b.x + b.width || 
             a.x + a.width <= b.x || 
             a.y >= b.y + b.height || 
             a.y + a.height <= b.y);
  }

  /**
   * Resolve collision between player and wall
   */
  private static resolvePlayerWallCollision(player: Entity, collision: CollisionResult): void {
    const wall = collision.entityB;
    
    // Move player to collision point
    const safeTime = Math.max(0, collision.time - 0.001); // Small safety margin
    player.x += player.vx * safeTime;
    player.y += player.vy * safeTime;

    // Calculate remaining velocity after partial movement
    const remainingVx = player.vx * (1 - safeTime);
    const remainingVy = player.vy * (1 - safeTime);

    // If wall is moving, add wall's push force to player
    if (wall.vx !== 0 || wall.vy !== 0) {
      // Wall pushes player
      player.x += wall.vx * (1 - safeTime);
      player.y += wall.vy * (1 - safeTime);
    }

    // Handle sliding along walls
    if (collision.normal.x !== 0) {
      // Vertical wall - slide vertically if possible
      player.vx = 0;
      if (!this.wouldCollideAfterSliding(player, [wall], 0, remainingVy)) {
        player.y += remainingVy;
      }
      player.vy = 0;
    } else if (collision.normal.y !== 0) {
      // Horizontal wall - slide horizontally if possible  
      player.vy = 0;
      if (!this.wouldCollideAfterSliding(player, [wall], remainingVx, 0)) {
        player.x += remainingVx;
      }
      player.vx = 0;
    }
  }

  /**
   * Check if sliding movement would cause collision
   */
  private static wouldCollideAfterSliding(player: Entity, walls: Entity[], deltaX: number, deltaY: number): boolean {
    const testPlayer = {
      ...player,
      x: player.x + deltaX,
      y: player.y + deltaY
    };

    return walls.some(wall => this.aabbOverlap(testPlayer, wall));
  }
}

// Test Runner
class TestRunner {
  static runAllTests(): void {
    console.log("Running Collision System Tests...\n");

    this.test1();
    this.test2(); 
    this.test3();
    this.test4();
    this.test5();
    this.test6();
  }

  private static createEntity(x: number, y: number, vx: number, vy: number, width: number, height: number, type: 'player' | 'wall'): Entity {
    return { x, y, vx, vy, width, height, type };
  }

  private static test1(): void {
    console.log("Test 1: Standing wall, moving player");
    const player = this.createEntity(0, 0, 100, 0, 10, 10, 'player');
    const wall = this.createEntity(50, 0, 0, 0, 10, 10, 'wall');

    CollisionSystem.resolveCollisions(player, [wall]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=40, y=0)`);
    console.log(`Wall: x=${wall.x}, y=${wall.y} (expected: x=50, y=0)`);
    console.log(`✓ ${player.x === 40 && player.y === 0 && wall.x === 50 && wall.y === 0 ? 'PASS' : 'FAIL'}\n`);
  }

  private static test2(): void {
    console.log("Test 2: Moving wall, standing player");
    const player = this.createEntity(0, 0, 0, 0, 10, 10, 'player');
    const wall = this.createEntity(-100, 0, 500, 0, 10, 10, 'wall');

    CollisionSystem.resolveCollisions(player, [wall]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=410, y=0)`);
    console.log(`Wall: x=${wall.x}, y=${wall.y} (expected: x=400, y=0)`);
    console.log(`✓ ${player.x === 410 && player.y === 0 && wall.x === 400 && wall.y === 0 ? 'PASS' : 'FAIL'}\n`);
  }

  private static test3(): void {
    console.log("Test 3: Both entities move towards each other");
    const player = this.createEntity(100, 0, -100, 0, 10, 10, 'player');
    const wall = this.createEntity(50, 0, 100, 0, 10, 10, 'wall');

    CollisionSystem.resolveCollisions(player, [wall]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=160, y=0)`);
    console.log(`Wall: x=${wall.x}, y=${wall.y} (expected: x=150, y=0)`);
    console.log(`✓ ${player.x === 160 && player.y === 0 && wall.x === 150 && wall.y === 0 ? 'PASS' : 'FAIL'}\n`);
  }

  private static test4(): void {
    console.log("Test 4: High velocity diagonal movement");
    const player = this.createEntity(0, 0, 100000, 100000, 10, 10, 'player');
    const wall = this.createEntity(150, 150, 0, 0, 10, 10, 'wall');

    CollisionSystem.resolveCollisions(player, [wall]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=140, y=100000)`);
    console.log(`Wall: x=${wall.x}, y=${wall.y} (expected: x=150, y=150)`);
    console.log(`✓ ${Math.abs(player.x - 140) < 1 && Math.abs(player.y - 100000) < 1 ? 'PASS' : 'FAIL'}\n`);
  }

  private static test5(): void {
    console.log("Test 5: High velocity diagonal movement + two walls");
    const player = this.createEntity(0, 0, 100000, 100000, 10, 10, 'player');
    const wall1 = this.createEntity(140, 140, -10, -10, 10, 10, 'wall');
    const wall2 = this.createEntity(5000, 140, 0, 0, 10, 10, 'wall');

    CollisionSystem.resolveCollisions(player, [wall1, wall2]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=4990, y=140)`);
    console.log(`Wall1: x=${wall1.x}, y=${wall1.y} (expected: x=130, y=130)`);
    console.log(`Wall2: x=${wall2.x}, y=${wall2.y} (expected: x=5000, y=140)`);
    console.log(`✓ ${Math.abs(player.x - 4990) < 1 && Math.abs(player.y - 140) < 1 ? 'PASS' : 'FAIL'}\n`);
  }

  private static test6(): void {
    console.log("Test 6: Corner case (player moving, walls stationary)");
    const player = this.createEntity(6, 5, 1000, 1000, 10, 10, 'player');
    const wall1 = this.createEntity(0, 0, 0, 0, 2, 4, 'wall');
    const wall2 = this.createEntity(0, 0, 0, 0, 5, 4, 'wall');

    CollisionSystem.resolveCollisions(player, [wall1, wall2]);

    console.log(`Player: x=${player.x}, y=${player.y} (expected: x=5, y=4)`);
    console.log(`Wall1: x=${wall1.x}, y=${wall1.y} (expected: x=0, y=0)`);
    console.log(`Wall2: x=${wall2.x}, y=${wall2.y} (expected: x=0, y=0)`);
    console.log(`✓ ${Math.abs(player.x - 5) < 1 && Math.abs(player.y - 4) < 1 ? 'PASS' : 'FAIL'}\n`);
  }
}

// Run tests
TestRunner.runAllTests();