import type { Train_Car_Movement_Directions } from "#root/Entities/Train_Stuff/Train_Car.js"
import type { Direction } from "#root/Type_Stuff.js"

export class Train_Car_Static {
 static createDirectionSet<T extends Train_Car_Movement_Directions>(dirs: T): Set<Direction> {
   validateMovementDirections(dirs);
  return new Set([...dirs].sort()); // Optional sort to normalize order
}


}

const VALID_MOVEMENT_DIRECTIONS: Set<string>[] = [
  new Set(), // ✅ Accept empty
  new Set(['up']),
  new Set(['down']),
  new Set(['left']),
  new Set(['right']),
  new Set(['left', 'up']),
  new Set(['left', 'down']),
  new Set(['right', 'up']),
  new Set(['right', 'down']),
];

function validateMovementDirections(
  dir: string[]
): asserts dir is Train_Car_Movement_Directions {
  const inputSet = new Set(dir);

  const isValid = VALID_MOVEMENT_DIRECTIONS.some(valid =>
    valid.size === inputSet.size &&
    [...valid].every(d => inputSet.has(d))
  );

  if (!isValid) {
    throw new Error(`Invalid train movement direction: [${dir.join(', ')}]`);
  }
}
