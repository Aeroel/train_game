import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Assert_That_Number_Is_Positive, Assert_That_Numbers_Are_Finite, Assert_That_Numbers_Are_Positive } from "#root/Type_Validation_Stuff.js";

export { Entity_Forces };
export type Force_Component = {
    key: string,
    forceValue: number,
    keepAtZero: boolean,
}
export type Forces = {
    up: Force_Component[],
    down: Force_Component[],
    right: Force_Component[],
    left: Force_Component[],

}
export type Forces_Values = {
    up: number,
    down: number,
    right: number,
    left: number
}
export type Force_Name = "up" | "right" | "left" | "down";

class Entity_Forces {
    entity: Base_Entity;
    Entities_That_Also_Get_The_Forces_Of_This_Entity = new Array();
    static readonly Possible_Forces = ["up", "down", "left", "right"];
    forces: Forces = {
        up: [],
        down: [],
        right: [],
        left: [],
    }
    threshold = 0.9;
    Get_Opposite_Force_Name(to: Force_Name): Force_Name {
        const isOppositeTo = {
            up: "down",
            down: "up",
            right: "left",
            left: "right",
        }
        return isOppositeTo[to as keyof Entity_Forces["forces"]] as Force_Name;
    }
    constructor(ofEntity: Base_Entity) {
        this.entity = ofEntity;

    }
    Get_No_Movement_Forces() {
        return { up: 0, down: 0, right: 0, left: 0 }
    }
    Init_A_Key_For_Each_Force(keyName: string) {
        this.setAll(keyName, { up: 0, down: 0, left: 0, right: 0 }, true);
    }
    Get_By_Key(key: string, forceName: Force_Name) {
        if (!this.Key_Exists_In_Force(key, forceName)) {
            throw new Error(`${key} not in ${forceName}, why?`);
        }
        const component = this.forces[forceName].find(component => component.key === key) as Force_Component;
        return component.forceValue;
    }
    Get_All_By_Key(key: string) {
        const result = { up: 0, down: 0, left: 0, right: 9 };
        result.up = this.Get_By_Key(key, "up");
        result.down = this.Get_By_Key(key, "down");
        result.left = this.Get_By_Key(key, "left");
        result.right = this.Get_By_Key(key, "right");

        // simple post check
        Assert_That_Numbers_Are_Finite(result);
        Assert_That_Numbers_Are_Positive(result);

        return result;

    }
    sumComponents(forceName: Force_Name) {
        let sum = 0;
        this.forces[forceName].forEach(forceComponent => {
            sum += forceComponent.forceValue;

        });
        return sum;
    }
    setAll(key: string, forces: Forces_Values, keepAtZero = false) {
        this.set(key, "up", forces.up, keepAtZero);
        this.set(key, "down", forces.down, keepAtZero);
        this.set(key, "right", forces.right, keepAtZero);
        this.set(key, "left", forces.left, keepAtZero);
    }
    set(key: string, forceName: Force_Name, forceValue: number, keepAtZero?: boolean) {
        Assert_That_Number_Is_Positive(forceValue);
        this.propagateSet(key, forceName, forceValue, keepAtZero)
        if (!this.Key_Exists_In_Force(key, forceName)) {
            if (typeof keepAtZero === "undefined") {
                keepAtZero = false
            }
            this.forces[forceName].push({ key, forceValue, keepAtZero });
            return;
        }
        const existingComponent = this.forces[forceName].find(component => component.key === key) as Force_Component;
        existingComponent.forceValue = forceValue;

    }
    Add_To_Propagation_List(entity: Base_Entity) {
        this.Entities_That_Also_Get_The_Forces_Of_This_Entity.push(entity)
    }
    propagateSet(key: string, forceName: Force_Name, forceValue: number, keepAtZero?: boolean) {
        if (this.Entities_That_Also_Get_The_Forces_Of_This_Entity.length === 0) {
            return;
        }
        const propagationKey = `${key}`
        this.Entities_That_Also_Get_The_Forces_Of_This_Entity.forEach(entity => {
            entity.forces.set(propagationKey, forceName, forceValue, keepAtZero)
        })
    }
    Key_Exists_In_Force(key: string, forceName: Force_Name) {
        if (!Entity_Forces.Possible_Forces.includes(forceName)) {
            throw new Error(`Force ${forceName} invalid`);
        }

        const existingComponent = this.forces[forceName].find(component => component.key === key);
        return existingComponent !== undefined;
    }
    applyFriction() {
        this.forEachComponent((component: Force_Component) => {
            component.forceValue *= (1 - this.entity.friction);
        });
        this.Remove_Components_That_Have_Their_Force_Values_Below_Threshold();
    }
    forEachComponent(doThis: (component: Force_Component) => void) {
        this.forces.up.forEach(doThis);
        this.forces.down.forEach(doThis);
        this.forces.right.forEach(doThis);
        this.forces.left.forEach(doThis);
    }
    Get_Net_Axis_Force(axis: "horizontal" | "vertical") {
        switch (axis) {
            case "horizontal":
                return this.sumComponents("right") - this.sumComponents("left")
                break;
            case "vertical":
                return this.sumComponents("down") - this.sumComponents("up")
                break;
        }

    }
    Remove_Components_That_Have_Their_Force_Values_Below_Threshold() {
        const filterFunc = (component: Force_Component) => component.forceValue > this.threshold || component.keepAtZero;
        this.forces.up = this.forces.up.filter(filterFunc);
        this.forces.down = this.forces.down.filter(filterFunc);
        this.forces.right = this.forces.right.filter(filterFunc);
        this.forces.left = this.forces.left.filter(filterFunc);
    }
}