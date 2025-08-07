
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = path.join(__dirname, 'collogs.txt');

export class Collision_Logger {
  static add(entry: string) {
    fs.appendFileSync(LOG_FILE, `${entry}\n`, 'utf-8');
  }

  static getHighest(): number {
    if (!fs.existsSync(LOG_FILE)) return 0;

    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    const matches = data.match(/\[(\d+)\]/g);
    if (!matches) return 0;

    const numbers = matches.map(s => parseInt(s.replace(/\[|\]/g, ''), 10));
    return Math.max(...numbers);
  }
}
