import {Base_Entity} from "#root/Entities/Base_Entity.js"
import {Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import {World} from "#root/World.js"
import type {Position} from "#root/Type_Stuff.js"
class Catapult_Gate extends Base_Entity{
  constructor(){
    super();
    this.addTag("Catapult_Gate");
  }
}
export class Catapult_Travel extends Base_Entity {
  gate1: Catapult_Gate;
  gate2: Catapult_Gate;
  justReachedGate1 = new Set<Base_Entity>();
  justReachedGate2 = new Set<Base_Entity>();
  constructor() {
   super();
   this.addTag("Catapult_Travel")
    this.gate1 = new Base_Entity();
    this.gate2 = new Base_Entity();
    this.gate1.setColor("pink")
    this.gate2.setColor("pink")
    this.gate1.Set_To_Square_Of_Size(100)
    this.gate2.Set_To_Square_Of_Size(100)


  }
  addPartsToWorld() {
    super.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld: true});
    World.addEntity(this.gate1);
    World.addEntity(this.gate2);
  }
  setGatePosition({gateNumber, position}: {gateNumber: number, position: Position}) {
    if(gateNumber ===1) {
      this.gate1.setPosition(position)
      return
    }
    this.gate2.setPosition(position);
  }
  updateState() {
    const iterGate1 = this.justReachedGate1.values()
    for (const pl of iterGate1) {
      const touching = Collision_Stuff.Check_For_Collision(this.gate1, pl);
      if(!touching) {
        this.justReachedGate1.delete(pl)
      }
    }
    const iterGate2 = this.justReachedGate2.values()
    for (const pl of iterGate2) {
      const touching = Collision_Stuff.Check_For_Collision(this.gate2, pl);
      if(!touching) {
        this.justReachedGate2.delete(pl)
      }
    }
    const thisTravel = this;
    const g1Colls = Collision_Stuff.findCollisions(this.gate1, (pl)=>pl.hasTag("Player")  && !(this.justReachedGate1.has(pl)) );
    for (const coll of g1Colls) {
      coll.entityB.setPosition(this.gate2.getPosition());
      this.justReachedGate2.add(coll.entityB);
    }
    
    const g2Colls = Collision_Stuff.findCollisions(this.gate2, (pl)=>pl.hasTag("Player") && !(this.justReachedGate2.has(pl)) );
    
      for (const coll of g2Colls) {
      coll.entityB.setPosition(this.gate1.getPosition());
            this.justReachedGate1.add(coll.entityB);
    }
    
  }
  
}