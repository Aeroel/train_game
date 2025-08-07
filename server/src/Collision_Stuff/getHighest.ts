// getHighest.ts
import { Collision_Logger } from './Collision_Logger.js';

const mode = process.argv[2];

if (mode === 'getHighest') {
  const highest = Collision_Logger.getHighest();
  console.log(`Highest calledTimes: ${highest}`);
} else {
  console.log(`Unknown mode: ${mode}`);
}
