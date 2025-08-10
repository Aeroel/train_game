import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = path.join(__dirname, 'log.txt');

function getHighest(): number {
  if (!fs.existsSync(LOG_FILE)) {
    console.log(0);
    return 0;
  }

  const data = fs.readFileSync(LOG_FILE, 'utf8').trim();
  if (!data) {
    console.log(0);
    return 0;
  }

  const numbers = data
    .split('\n')
    .map(line => parseFloat(line))
    .filter(n => Number.isFinite(n));

  if (numbers.length === 0) {
    console.log(0);
    return 0;
  }

  const max = Math.max(...numbers);
  console.log(max);
  return max;
}

getHighest();
