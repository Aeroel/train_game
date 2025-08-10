import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = path.join(__dirname, 'log.txt');

export class Collision_Logger {
  static add(num: number) {
    if (!Number.isFinite(num)) {
      throw new Error(`Invalid number for CollisionLogger: ${num}`);
    }
    fs.appendFileSync(LOG_FILE, `${num}\n`, 'utf8');
  }
}
