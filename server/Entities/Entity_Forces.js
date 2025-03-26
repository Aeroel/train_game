export { Entity_Forces };
class Entity_Forces {
    entity;
    Entities_That_Also_Get_The_Forces_Of_This_Entity = new Array();
    possibleForces = ["up", "down", "left", "right"];
    forces = {
        up: [],
        down: [],
        right: [],
        left: []
    };
    threshold = 0.9;
    constructor(ofEntity) {
        this.entity = ofEntity;

    }
    Get_No_Movement_Forces() {
        return {up:0, down:0, right:0,left:0}
    }
    Init_A_Key_For_Each_Force(keyName) {
        this.setAll(keyName, { up: 0, down: 0, left: 0, right: 0 }, true);
    }
    Get_By_Key(key, forceName) {
        if (!this.Key_Exists_In_Force(key, forceName)) {
            throw new Error(`${key} not in ${forceName}, why?`);
        }
        const component = this.forces[forceName].find(component => component.key === key);
        return component.forceValue;
    }
    Get_All_By_Key(key) {
        const result = { up: undefined, down: undefined, left: undefined, right: undefined };
        result.up = this.Get_By_Key(key, "up");
        result.down = this.Get_By_Key(key, "down");
        result.left = this.Get_By_Key(key, "left");
        result.right = this.Get_By_Key(key, "right");

        // simple post check
        if (result.up === undefined ||
            result.down === undefined ||
            result.right === undefined ||
            result.left === undefined
        ) {
            throw new Error(`Calling thiss presupposes that all four forces contain ${key} values, but some of them don't. Here are the contents of result: ${JSON.stringify(result)}`);
        }

        return result;

    }
    sumComponents(forceName) {
        let sum = 0;
        this.forces[forceName].forEach(forceComponent => {
            sum += forceComponent.forceValue;
            
        });
        return sum;
    }
    setAll(key, forces, keepAtZero = false) {
        this.set(key, "up", forces.up, keepAtZero);
        this.set(key, "down", forces.down, keepAtZero);
        this.set(key, "right", forces.right, keepAtZero);
        this.set(key, "left", forces.left, keepAtZero);
    }
    set(key, forceName, forceValue, keepAtZero) {
        this.propagateSet(key, forceName, forceValue, keepAtZero)
        if (!this.Key_Exists_In_Force(key, forceName)) {
            this.forces[forceName].push({ key, forceValue, keepAtZero });
            return;
        }
        const existingComponent = this.forces[forceName].find(component => component.key === key);
        existingComponent.forceValue = forceValue;
        
    }
    Add_To_Propagation_List(entity) {
      this.Entities_That_Also_Get_The_Forces_Of_This_Entity.push(entity)
    }
    propagateSet(key, forceName, forceValue, keepAtZero) {
            if(this.Entities_That_Also_Get_The_Forces_Of_This_Entity.length===0) {
        return;
      }
      const propagationKey =`${key}`
      this.Entities_That_Also_Get_The_Forces_Of_This_Entity.forEach(entity => {
        entity.forces.set(propagationKey, forceName, forceValue, keepAtZero)
      })
    }
    Key_Exists_In_Force(key, forceName) {
        if(!this.possibleForces.includes(forceName)) {
            throw new Error(`Force ${forceName} invalid`);
        }
        
        const existingComponent = this.forces[forceName].find(component => component.key === key);
        return existingComponent !== undefined;
    }
    applyFriction() {
        this.forEachComponent(component => {
            component.forceValue *= (1 - this.entity.friction);
        });
        this.Remove_Components_That_Have_Their_Force_Values_Below_Threshold();
    }
    forEachComponent(doThis) {
        this.forces.up.forEach(doThis);
        this.forces.down.forEach(doThis);
        this.forces.right.forEach(doThis);
        this.forces.left.forEach(doThis);
    }
    Remove_Components_That_Have_Their_Force_Values_Below_Threshold() {
        const filterFunc = component => component.forceValue > this.threshold || component.keepAtZero;
        this.forces.up = this.forces.up.filter(filterFunc);
        this.forces.down = this.forces.down.filter(filterFunc);
        this.forces.right = this.forces.right.filter(filterFunc);
        this.forces.left = this.forces.left.filter(filterFunc);
    }
}