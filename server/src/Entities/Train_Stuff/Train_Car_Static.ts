import type { Train_Car, Train_Car_Motion_Directions, Train_Car_Motion } from "#root/Entities/Train_Stuff/Train_Car.js"
import type { Direction } from "#root/Type_Stuff.js"
import { My_Assert } from "#root/My_Assert.js"

export class Train_Car_Static {
 
 
static setMotionsDirections(car: Train_Car, forwards: Train_Car_Motion_Directions, backwards: Train_Car_Motion_Directions) {
     Train_Car_Static.assertThatBothAreOpposite(forwards, backwards);
     Train_Car_Static.setMotionDirections(car, "forwards", forwards);
     Train_Car_Static.setMotionDirections(car, "backwards", backwards);
}
static setMotionDirections(car: Train_Car, motion: Train_Car_Motion, motionDirs: Train_Car_Motion_Directions) {
  My_Assert.that(motion !== null);
this.validateMotionDirections(motionDirs);
  car.motionsDirections[motion] = motionDirs;
}
 
 static validateMotionDirections(dirs: string[]): asserts dirs is Train_Car_Motion_Directions {
  const sorted = [...dirs].sort();

  const isValid = VALID_MOTION_DIRECTIONS.some(valid => {
    return (
      valid.length === sorted.length &&
      [...valid].sort().every((v, i) => v === sorted[i])
    );
  });

  if (!isValid) {
    throw new Error(`Invalid motion directions: [${dirs.join(', ')}]`);
  }
}
 static assertThatBothAreOpposite(
  a: string[],
  b: string[]
): asserts a is Train_Car_Motion_Directions & typeof a & typeof b {
  this.validateMotionDirections(a);
  this.validateMotionDirections(b);

  if (a.length === 0 || b.length === 0) {
    throw new Error(`One or both direction sets are empty`);
  }

  const combined = [...a, ...b];

  // Count occurrences of each direction
  const counts: Record<Direction, number> = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  for (const dir of combined) {
    if (dir in counts) {
      counts[dir as Direction]++;
    }
  }

  // Ensure for every direction, count == count of its opposite
  for (const dir of Object.keys(counts) as Direction[]) {
    const opp = OPPOSITE[dir];
    if (counts[dir] !== counts[opp]) {
      throw new Error(
        `Direction sets are not opposite. '${dir}' count = ${counts[dir]}, '${opp}' count = ${counts[opp]}`
      );
    }
  }
}


}

const VALID_MOTION_DIRECTIONS: Direction[][] = [
  [],
  ['up'],
  ['down'],
  ['left'],
  ['right'],
  ['left', 'up'],
  ['up', 'left'],
  ['left', 'down'],
  ['down', 'left'],
  ['right', 'up'],
  ['up', 'right'],
  ['right', 'down'],
  ['down', 'right'],
];

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

