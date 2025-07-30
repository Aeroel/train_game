import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Position, Collision_Info} from "#root/Type_Stuff.js";

export { Collision_Stuff, };
class Collision_Stuff {
  static Do_Entities_Touch_Through_All_Tick_Subpositions(entityA: Base_Entity, entityB: Base_Entity) {
    const { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions } = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);
    let Do_Entities_Collide_At_All_Subpositions = true;

    for (let i = 0; i < entitiesSubpositionsArrays.lengthOfEither; i++) {
      const subEA = {
        width: entityA.width,
        height: entityA.height,
        x: entityASubpositions[i].x,
        y: entityASubpositions[i].y,
      };
      const subEB = {
        width: entityB.width,
        height: entityB.height,
        x: entityBSubpositions[i].x,
        y: entityBSubpositions[i].y,
      };

      if (!Collision_Stuff.checkTouchOrIntersect(subEA, subEB)) {
        Do_Entities_Collide_At_All_Subpositions = false;
        return Do_Entities_Collide_At_All_Subpositions;
      }

    }


  }
  static checkForIntersection(a: Box, b: Box): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static areEntitiesIntersecting(entityA: Base_Entity, entityB: Base_Entity) {
    let Collision_Occurred = false;
    let Position_Before_Collision_A: Position = { x: entityA.x, y: entityA.y };
    let Position_Before_Collision_B: Position = { x: entityB.x, y: entityB.y };
    const loop = new Subpositions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Collision_Stuff.checkForIntersection(subA, subB)) {
        Collision_Occurred = true;
        loop.stop();
      }
      Position_Before_Collision_A = { x: subA.x, y: subA.y }
      Position_Before_Collision_B = { x: subB.x, y: subB.y }
    })


    const result: Collision_Info = { Collision_Occurred, Position_Before_Collision_A, Position_Before_Collision_B, entityA, entityB };
    return result;

  }
  static Did_A_Collision_Occur_And_What_Is_The_Position_Just_Before_Collision(entityA: Base_Entity, entityB: Base_Entity) {


    let Collision_Occurred = false;
    let Position_Before_Collision_A: Position = { x: entityA.x, y: entityA.y };
    let Position_Before_Collision_B: Position = { x: entityB.x, y: entityB.y };


    const loop = new Subpositions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Collision_Stuff.checkTouchOrIntersect(subA, subB)) {
        Collision_Occurred = true;
        loop.stop();
      }
      Position_Before_Collision_A = { x: subA.x, y: subA.y }
      Position_Before_Collision_B = { x: subB.x, y: subB.y }
    })


    const result = { Collision_Occurred, Position_Before_Collision_A, Position_Before_Collision_B };
    return result;


  }
  static areEntitiesTouching(entityA: Base_Entity, entityB: Base_Entity): boolean {
    const { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions } = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);

    let collHappenedAtAnyTime = false;

    for (let i = 0; i < entitiesSubpositionsArrays.lengthOfEither; i++) {
      const subEA = {
        width: entityA.width,
        height: entityA.height,
        x: entityASubpositions[i].x,
        y: entityASubpositions[i].y,
      };
      const subEB = {
        width: entityB.width,
        height: entityB.height,
        x: entityBSubpositions[i].x,
        y: entityBSubpositions[i].y,
      };

      if (Collision_Stuff.checkTouchOrIntersect(subEA, subEB)) {
        collHappenedAtAnyTime = true;
        return collHappenedAtAnyTime;
      }

    }

    return collHappenedAtAnyTime;


  }

  static Which_Side_Of_Entity_Is_Facing_Another_Entity(entityA: Box, entityB: Box) {
    const aCenterX = entityA.x + entityA.width / 2;
    const aCenterY = entityA.y + entityA.height / 2;
    const bCenterX = entityB.x + entityB.width / 2;
    const bCenterY = entityB.y + entityB.height / 2;

    const deltaX = bCenterX - aCenterX;
    const deltaY = bCenterY - aCenterY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      if (deltaX > 0) {
        return 'right';
      } else {
        return 'left';
      }
    }

    if (deltaY > 0) {
      return 'bottom'
    } else {
      return 'top';
    }
  }

  static Get_Prelude_To_Subpositions_Loop(entityA: Base_Entity, entityB: Base_Entity) {
    if (!entityA.hasTag("Entity") || !entityB.hasTag("Entity")) {
      throw new Error(`Both arguments must be entities`)
    }
    const entityAStartingPosition: Position = { x: entityA.x, y: entityA.y };
    const entityBStartingPosition: Position = { x: entityB.x, y: entityB.y };

    const entityAEndingPosition: Position = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
    const entityBEndingPosition: Position = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();

    const entitiesSubpositionsArrays = Collision_Stuff.getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

    const entityASubpositions = entitiesSubpositionsArrays.entityA;
    const entityBSubpositions = entitiesSubpositionsArrays.entityB;

    return { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions };
  }

  static getSubpositions(entityAStartingPosition: Position, entityAEndingPosition: Position, entityBStartingPosition: Position, entityBEndingPosition: Position) {

    // here begins determination of how long each array will be. It is a single number
    const entityADeltaX = entityAEndingPosition.x - entityAStartingPosition.x;
    const entityADeltaY = entityAEndingPosition.y - entityAStartingPosition.y;

    const entityATheoreticalLength = Math.max(Math.abs(entityADeltaX), Math.abs(entityADeltaY));


    const entityBDeltaX = entityBEndingPosition.x - entityBStartingPosition.x;
    const entityBDeltaY = entityBEndingPosition.y - entityBStartingPosition.y;

    const entityBTheoreticalLength = Math.max(Math.abs(entityBDeltaX), Math.abs(entityBDeltaY));

    let finalLength = Math.round((Math.max(entityATheoreticalLength, entityBTheoreticalLength)));

    // now we know the length. Make two arrays.

    const entityASubpositions = [{ ...entityAStartingPosition },
    ];
    const entityBSubpositions = [
      { ...entityBStartingPosition }
    ];

    const AChangePerSubStepX = entityADeltaX / finalLength;
    const AChangePerSubStepY = entityADeltaY / finalLength;

    const BChangePerSubStepX = entityBDeltaX / finalLength;
    const BChangePerSubStepY = entityBDeltaY / finalLength;

    for (let i = 1; i < finalLength; i++) {
      const ASubpos = {
        x: entityAStartingPosition.x + (i * AChangePerSubStepX),
        y: entityAStartingPosition.y + (i * AChangePerSubStepY),
      };
      entityASubpositions.push(ASubpos);

      const BSubpos = {
        x: entityBStartingPosition.x + (i * BChangePerSubStepX),
        y: entityBStartingPosition.y + (i * BChangePerSubStepY),
      };
      entityBSubpositions.push(BSubpos);

    }

    entityASubpositions.push({ ...entityAEndingPosition });
    entityBSubpositions.push({ ...entityBEndingPosition });

    // now subpositions are ready, send them to callee
    return {
      entityA: entityASubpositions,
      entityB: entityBSubpositions,
      lengthOfEither: entityBSubpositions.length,
    };
  }

  static checkTouchOrIntersect(boxA: Box, boxB: Box) {
    const { x: x1, y: y1, width: w1, height: h1 } = boxA;
    const { x: x2, y: y2, width: w2, height: h2 } = boxB;

    return !(x1 + w1 < x2 || // Entity A is to the left of Entity B
      x2 + w2 < x1 || // Entity B is to the left of Entity A
      y1 + h1 < y2 || // Entity A is above Entity B
      y2 + h2 < y1);   // Entity B is above Entity A
  }


}


class Subpositions_Loop {
  shouldStop = false;
  result = false;
  entityA: Base_Entity;
  entityB: Base_Entity;
  entityASubpositions: Position[];
  entityBSubpositions: Position[];
  loopLength: number;

  constructor(
    entityA: Base_Entity,
    entityB: Base_Entity,
  ) {
    this.entityA = entityA;
    this.entityB = entityB;

    const { entitiesSubpositionsArrays } = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);

    this.entityASubpositions = entitiesSubpositionsArrays.entityA;
    this.entityBSubpositions = entitiesSubpositionsArrays.entityB;
    this.loopLength = entitiesSubpositionsArrays.lengthOfEither;
  }

  run(thisFunction: (current_index: number, subA: Box, subB: Box) => void): boolean {
    for (let current_index = 0; current_index < this.loopLength && !this.shouldStop; current_index++) {
      const subA = this.createSubEntity(this.entityA, this.entityASubpositions[current_index]);
      const subB = this.createSubEntity(this.entityB, this.entityBSubpositions[current_index]);

      thisFunction(current_index, subA, subB);
    }
    return this.result;
  }

  stop(result: boolean = true): void {
    this.shouldStop = true;
    this.result = result;
  }

  createSubEntity(entity: Base_Entity, position: Position): Box {
    return {
      width: entity.width,
      height: entity.height,
      ...position
    };
  }
}
