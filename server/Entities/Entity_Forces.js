export { Entity_Forces };
class Entity_Forces {
    entity;
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
    Get_By_Key(key, forceName) {
        if (!this.Key_Exists_In_Force(key, forceName)) {
            throw new Error(`${key} not in ${forceName}, why?`);
        }
        return this.forces[forceName].find(component => component.key === key);
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
    setAll(key, forces) {
        this.set(key, "up", forces.up);
        this.set(key, "down", forces.down);
        this.set(key, "right", forces.right);
        this.set(key, "left", forces.left);
    }
    set(key, forceName, forceValue) {
        if (!this.Key_Exists_In_Force(key, forceName)) {
            this.forces[forceName].push({ key, forceValue });
            return;
        }
        const existingComponent = this.forces[forceName].find(component => component.key === key);
        existingComponent.forceValue = forceValue;
    }
    Key_Exists_In_Force(key, forceName) {
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
        this.forces.up = this.forces.up.filter(component => component.forceValue > this.threshold);
        this.forces.down = this.forces.down.filter(component => component.forceValue > this.threshold);
        this.forces.right = this.forces.right.filter(component => component.forceValue > this.threshold);
        this.forces.left = this.forces.left.filter(component => component.forceValue > this.threshold);
    }
}