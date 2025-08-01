import {Base_Entity} from "#root/Entities/Base_Entity.js"
import { type Position, type Box } from "#root/Type_Stuff.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"

export { Subpositions_Loop }

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

   const prelude = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);
    const entitiesSubpositionsArrays = prelude.entitiesSubpositionsArrays;

   

    this.entityASubpositions = entitiesSubpositionsArrays.entityA;
    this.entityBSubpositions = entitiesSubpositionsArrays.entityB;
    this.loopLength = entitiesSubpositionsArrays.lengthOfEither;
  }

  run(
    thisFunction: (current_index: number, subA: Box, subB: Box) => void
    ): boolean {
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
