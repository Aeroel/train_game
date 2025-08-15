var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var EPS = 1e-7;
function clone(o) {
    return JSON.parse(JSON.stringify(o));
}
function rectsOverlap(a, b) {
    return !(a.x + a.width <= b.x ||
        a.x >= b.x + b.width ||
        a.y + a.height <= b.y ||
        a.y >= b.y + b.height);
}
/**
 * Swept AABB between a moving rect (with RELATIVE velocity vRel) and a static rect.
 * moving, target are positions at the CURRENT time.
 * dt is the remaining time window (1 frame = 1).
 */
function sweptAABB(moving, target, vRelX, vRelY, dt) {
    // If already overlapping, treat as immediate hit at t=0.
    if (rectsOverlap(moving, target)) {
        // Choose the smaller penetration axis as the collision normal.
        var dxLeft = (moving.x + moving.width) - target.x;
        var dxRight = (target.x + target.width) - moving.x;
        var dyTop = (moving.y + moving.height) - target.y;
        var dyBottom = (target.y + target.height) - moving.y;
        var minX = Math.min(dxLeft, dxRight);
        var minY = Math.min(dyTop, dyBottom);
        if (minX < minY) {
            return { hit: true, t: 0, nx: dxLeft < dxRight ? -1 : 1, ny: 0 };
        }
        else {
            return { hit: true, t: 0, nx: 0, ny: dyTop < dyBottom ? -1 : 1 };
        }
    }
    // Compute entry/exit times for X
    var txEntry, txExit;
    if (Math.abs(vRelX) < EPS) {
        // No relative motion on X; if separated on X, they will never meet via X.
        if (moving.x + moving.width <= target.x || moving.x >= target.x + target.width) {
            return { hit: false, t: Infinity, nx: 0, ny: 0 };
        }
        txEntry = -Infinity;
        txExit = Infinity;
    }
    else {
        var xInvEntry = vRelX > 0
            ? target.x - (moving.x + moving.width)
            : (target.x + target.width) - moving.x;
        var xInvExit = vRelX > 0
            ? (target.x + target.width) - moving.x
            : target.x - (moving.x + moving.width);
        txEntry = xInvEntry / vRelX;
        txExit = xInvExit / vRelX;
    }
    // Compute entry/exit times for Y
    var tyEntry, tyExit;
    if (Math.abs(vRelY) < EPS) {
        if (moving.y + moving.height <= target.y || moving.y >= target.y + target.height) {
            return { hit: false, t: Infinity, nx: 0, ny: 0 };
        }
        tyEntry = -Infinity;
        tyExit = Infinity;
    }
    else {
        var yInvEntry = vRelY > 0
            ? target.y - (moving.y + moving.height)
            : (target.y + target.height) - moving.y;
        var yInvExit = vRelY > 0
            ? (target.y + target.height) - moving.y
            : target.y - (moving.y + moving.height);
        tyEntry = yInvEntry / vRelY;
        tyExit = yInvExit / vRelY;
    }
    var tEntry = Math.max(txEntry, tyEntry);
    var tExit = Math.min(txExit, tyExit);
    if (tEntry > tExit || tExit < 0 || tEntry > dt) {
        return { hit: false, t: Infinity, nx: 0, ny: 0 };
    }
    // Determine normal by dominant axis at entry time.
    // Break ties preferring Y so diagonal hits block vertical first (matches your Test 4).
    var nx = 0, ny = 0;
    if (txEntry > tyEntry) {
        nx = vRelX > 0 ? -1 : 1;
    }
    else {
        ny = vRelY > 0 ? -1 : 1;
    }
    var tHit = Math.max(0, tEntry);
    return { hit: true, t: tHit, nx: nx, ny: ny };
}
/**
 * Simulate one frame (dt=1) for player vs an array of walls.
 * Walls move freely; player is resolved continuously and slides.
 */
function resolvePlayerVsWalls(playerIn, wallsIn) {
    var player = clone(playerIn);
    var walls = wallsIn.map(clone);
    // We'll treat time in [0,1]
    var tNow = 0;
    var remain = 1;
    // Player velocity per frame (constant between collisions, but we will modify it on hits).
    var vpX = player.vx;
    var vpY = player.vy;
    // Precompute wall velocities and initial positions
    var wInit = walls.map(function (w) { return ({ x: w.x, y: w.y, vx: w.vx, vy: w.vy, width: w.width, height: w.height }); });
    // Iterate through collisions within the frame
    for (var iter = 0; iter < 16 && remain > EPS; iter++) {
        // Find earliest collision among walls
        var best = null;
        for (var i = 0; i < wInit.length; i++) {
            var w_1 = wInit[i];
            // Wall position at current time
            var wx = w_1.x + w_1.vx * tNow;
            var wy = w_1.y + w_1.vy * tNow;
            var wallSnapshot = { x: wx, y: wy, vx: 0, vy: 0, width: w_1.width, height: w_1.height };
            // Relative velocity over real time
            var vRelX = vpX - w_1.vx;
            var vRelY = vpY - w_1.vy;
            var hit = sweptAABB({ x: player.x, y: player.y, vx: 0, vy: 0, width: player.width, height: player.height }, wallSnapshot, vRelX, vRelY, remain);
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
        var w = wInit[best.wallIndex];
        var wxAtHit = w.x + w.vx * tNow;
        var wyAtHit = w.y + w.vy * tNow;
        if (best.nx !== 0) {
            // Collided along X
            if (best.nx === -1) {
                // Player came from left moving right relative to wall
                player.x = wxAtHit - player.width - EPS;
            }
            else {
                // Player came from right moving left relative to wall
                player.x = wxAtHit + w.width + EPS;
            }
            // Zero relative motion on X => player X velocity becomes wall's X velocity
            vpX = w.vx;
            // Y velocity unchanged (sliding)
        }
        else if (best.ny !== 0) {
            // Collided along Y
            if (best.ny === -1) {
                // Player came from above
                player.y = wyAtHit - player.height - EPS;
            }
            else {
                // Player came from below
                player.y = wyAtHit + w.height + EPS;
            }
            // Zero relative motion on Y => player Y velocity becomes wall's Y velocity
            vpY = w.vy;
            // X velocity unchanged (sliding)
        }
        else {
            // Shouldn't happen, but let's bail safely
            break;
        }
        // Continue loop for remaining time; velocities updated already
    }
    // Final wall positions: they always complete their move
    var wallsFinal = walls.map(function (w, i) { return (__assign(__assign({}, w), { x: wInit[i].x + wInit[i].vx, y: wInit[i].y + wInit[i].vy })); });
    return { player: player, walls: wallsFinal };
}
/* =========================
   TESTS
   ========================= */
function assertClose(actual, expected, label, eps) {
    if (eps === void 0) { eps = 1e-4; }
    if (Math.abs(actual - expected) > eps) {
        throw new Error("".concat(label, ": expected ").concat(expected, ", got ").concat(actual));
    }
}
function runTest(name, player, walls, expectedPlayer, expectedWalls) {
    var _a = resolvePlayerVsWalls(player, walls), p = _a.player, ws = _a.walls;
    console.log(name, "=> Player", { x: p.x, y: p.y }, "Walls", ws.map(function (w) { return ({ x: w.x, y: w.y }); }));
    assertClose(p.x, expectedPlayer.x, "".concat(name, " player.x"));
    assertClose(p.y, expectedPlayer.y, "".concat(name, " player.y"));
    for (var i = 0; i < expectedWalls.length; i++) {
        assertClose(ws[i].x, expectedWalls[i].x, "".concat(name, " wall").concat(i + 1, ".x"));
        assertClose(ws[i].y, expectedWalls[i].y, "".concat(name, " wall").concat(i + 1, ".y"));
    }
}
// Test 1. Standing wall, moving player
runTest("Test 1", { x: 0, y: 0, vx: 100, vy: 0, width: 10, height: 10 }, [{ x: 50, y: 0, vx: 0, vy: 0, width: 10, height: 10 }], { x: 40, y: 0 }, [{ x: 50, y: 0 }]);
// Test 2. Moving wall, standing player
runTest("Test 2", { x: 0, y: 0, vx: 0, vy: 0, width: 10, height: 10 }, [{ x: -100, y: 0, vx: 500, vy: 0, width: 10, height: 10 }], { x: 410, y: 0 }, [{ x: 400, y: 0 }]);
// Test 3. Both move towards each other
runTest("Test 3", { x: 100, y: 0, vx: -100, vy: 0, width: 10, height: 10 }, [{ x: 50, y: 0, vx: 100, vy: 0, width: 10, height: 10 }], { x: 160, y: 0 }, [{ x: 150, y: 0 }]);
// Test 4. High velocity diagonal movement
runTest("Test 4", { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 }, [{ x: 150, y: 150, vx: 0, vy: 0, width: 10, height: 10 }], { x: 100000, y: 140 }, [{ x: 150, y: 150 }]);
// Test 5. High velocity diagonal + two walls
// NOTE: Fixed your sign to match your expected final wall position.
runTest("Test 5", { x: 0, y: 0, vx: 100000, vy: 100000, width: 10, height: 10 }, [
    { x: 140, y: 140, vx: 10, vy: 10, width: 10, height: 10 }, // fixed (+10, +10)
    { x: 5000, y: 140, vx: 0, vy: 0, width: 10, height: 10 }
], { x: 4990, y: 140 }, [
    { x: 150, y: 150 }, // wall 1
    { x: 5000, y: 140 } // wall 2
]);
console.log("All tests passed.");
