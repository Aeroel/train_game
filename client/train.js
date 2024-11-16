const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const mapSize = 10000;
const stationCount = 7;
const stationDistance = 1000;
const playerVisionRange = 500;

// Entities and state
const player = { x: 100, y: 100, width: 20, height: 20, speed: 3 };
const train = { x: 0, y: 1000, cars: 7, length: 700, currentStation: 0, moving: true, misaligned: false };
const stations = Array.from({ length: stationCount }, (_, i) => ({
  x: i * stationDistance,
  y: 1000,
  walls: true,
  doorsAligned: false,
  timer: 0,
}));

let joystickInput = { x: 0, y: 0 };

// Helper functions
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x - playerVisionRange, player.y - playerVisionRange, player.width, player.height);
}

function drawTrain() {
  ctx.fillStyle = train.misaligned ? 'red' : 'green';
  ctx.fillRect(train.x - player.x + playerVisionRange, train.y - player.y + playerVisionRange, train.length, 50);

  // Draw train doors
  const carLength = train.length / train.cars;
  for (let i = 0; i < train.cars; i++) {
    ctx.fillStyle = train.doorsAligned ? 'cyan' : 'orange';
    ctx.fillRect(
      train.x - player.x + playerVisionRange + i * carLength,
      train.y - player.y + playerVisionRange,
      10,
      50
    );
  }
}

function drawStations() {
  for (const station of stations) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(station.x - player.x + playerVisionRange, station.y - player.y + playerVisionRange, 300, 50);

    // Draw station doors
    const doorWidth = 300 / 7;
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = station.doorsAligned ? 'cyan' : 'orange';
      ctx.fillRect(
        station.x - player.x + playerVisionRange + i * doorWidth,
        station.y - player.y + playerVisionRange,
        10,
        50
      );
    }
  }
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player based on joystick
  player.x += joystickInput.x * player.speed;
  player.y += joystickInput.y * player.speed;

  // Keep player within bounds
  player.x = Math.max(0, Math.min(mapSize - player.width, player.x));
  player.y = Math.max(0, Math.min(mapSize - player.height, player.y));

  // Train logic
  const currentStation = stations[train.currentStation];
  if (train.moving) {
    train.x += 2; // Train moves
    if (Math.abs(train.x - currentStation.x) < 10) {
      train.moving = false;
      train.misaligned = Math.random() > 0.7; // Random misalignment
    }
  } else if (train.misaligned) {
    // Adjust train to align doors
    const misalignment = train.x - currentStation.x;
    if (Math.abs(misalignment) > 2) {
      train.x -= Math.sign(misalignment) * 1; // Adjust slowly
    } else {
      train.misaligned = false;
      train.doorsAligned = true;
    }
  } else {
    // Doors open, wait, then move to next station
    currentStation.timer++;
    if (currentStation.timer > 200) {
      train.currentStation = (train.currentStation + 1) % stationCount;
      train.moving = true;
      train.doorsAligned = false;
      currentStation.timer = 0;
    }
  }

  // Drawing
  drawPlayer();
  drawTrain();
  drawStations();

  requestAnimationFrame(gameLoop);
}

// Joystick Input (Mock Example)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') joystickInput.y = -1;
  if (e.key === 'ArrowDown') joystickInput.y = 1;
  if (e.key === 'ArrowLeft') joystickInput.x = -1;
  if (e.key === 'ArrowRight') joystickInput.x = 1;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') joystickInput.y = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') joystickInput.x = 0;
});

// Start game
gameLoop();
