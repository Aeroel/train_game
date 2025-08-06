import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js"
import { Assert_That_Number_Is_Zero_Or_Positive, Assert_That_Numbers_Are_Finite, Assert_That_Numbers_Are_Zero_Or_Positive } from "#root/Type_Validation_Stuff.js";

export type Force_Component = {
    key: string,
    forceValue: number,
    keepAtZero: boolean,
}
export type Directions_Force_Components = {
    up: Force_Component[],
    down: Force_Component[],
    right: Force_Component[],
    left: Force_Component[],

}
export type Directions_Values = {
    up: number,
    down: number,
    right: number,
    left: number
}
export type Force_Direction = Direction;


export { Entity_Movement_Forces };
class Entity_Movement_Forces {
    entity: Base_Entity;
    Entities_That_Also_Get_The_Forces_Of_This_Entity: Base_Entity[] = new Array();
    static readonly Possible_Directions = ["up", "down", "left", "right"];
    directions_and_their_components: Directions_Force_Components= {
        up: [],
        down: [],
        right: [],
        left: [],
    }
    removeForceComponentWhenValueHitsBelow = 0.9;
    
    
Get_Opposite_Force_Direction(to: Force_Direction): Force_Direction {
    const isOppositeTo: Record<Force_Direction, Force_Direction> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
    };

    return isOppositeTo[to];
}
    
    
    constructor(ofEntity: Base_Entity) {
        this.entity = ofEntity;

    }
    
    
    Get_No_Movement_Forces() {
        return { up: 0, down: 0, right: 0, left: 0 }
    }
    Init_A_Component_With_Same_Key_For_Each_Direction(keyName: string) {
        this.Set_A_Component_For_Each_Direction_By_Same_Key(keyName, { up: 0, down: 0, left: 0, right: 0 }, true);
    }
    Get_Direction_Component_By_Key(key: string, forceDirection: Force_Direction) {
        if (!this.Component_Exists_In_Direction(key, forceDirection)) {
            throw new Error(`${key} not in ${forceDirection}, why?`);
        }
        const component = this.directions_and_their_components[forceDirection].find(component => component.key === key) as Force_Component;
        return component;
    }
    Get_A_Component_From_Each_Direction_By_Key(key: string) {
        const result = { up: 0, down: 0, left: 0, right: 9 };
        result.up = this.Get_Direction_Component_By_Key(key, "up").forceValue;
        result.down = this.Get_Direction_Component_By_Key(key, "down").forceValue;
        result.left = this.Get_Direction_Component_By_Key(key, "left").forceValue;
        result.right = this.Get_Direction_Component_By_Key(key, "right").forceValue;

        // simple post check
        Assert_That_Numbers_Are_Finite(result);
        Assert_That_Numbers_Are_Zero_Or_Positive(result);

        return result;

    }
    sumComponents(forceDirection: Force_Direction) {
        let sum = 0;
        this.directions_and_their_components[forceDirection].forEach(forceComponent => {
            sum += forceComponent.forceValue;

        });
        return sum;
    }
    Set_A_Component_For_Each_Direction_By_Same_Key(key: string, directionsValues: Directions_Values, keepAtZero = false) {
        this.Set_Component(key, "up", directionsValues.up, keepAtZero);
        this.Set_Component(key, "down", directionsValues.down, keepAtZero);
        this.Set_Component(key, "right", directionsValues.right, keepAtZero);
        this.Set_Component(key, "left", directionsValues.left, keepAtZero);
    }
    Set_Component(key: string, forceDirection: Force_Direction, forceValue: number, keepAtZero?: boolean) {
        Assert_That_Number_Is_Zero_Or_Positive(forceValue);
        this.Set_Component_For_Each_Entity_That_Is_In_Propagation_List(key, forceDirection, forceValue, keepAtZero)
        if (!this.Component_Exists_In_Direction(key, forceDirection)) {
            if (typeof keepAtZero === "undefined") {
                keepAtZero = false
            }
            this.directions_and_their_components[forceDirection].push({ key, forceValue, keepAtZero });
            return;
        }

        const existingComponent = this.directions_and_their_components[forceDirection].find(component => component.key === key) as Force_Component;
        existingComponent.forceValue = forceValue;

    }
    Add_Entity_To_Propagation_List(entity: Base_Entity) {
        this.Entities_That_Also_Get_The_Forces_Of_This_Entity.push(entity)
    }
    Set_Component_For_Each_Entity_That_Is_In_Propagation_List(key: string, forceDirection: Force_Direction, forceValue: number, keepAtZero?: boolean) {
        if (this.Entities_That_Also_Get_The_Forces_Of_This_Entity.length === 0) {
            return;
        }
        const propagationKey = `${key}`
        this.Entities_That_Also_Get_The_Forces_Of_This_Entity.forEach(entity => {
            entity.movementForces.Set_Component(propagationKey, forceDirection, forceValue, keepAtZero)
        })
    }
    
    Component_Exists_In_Direction(key: string, forceDirection: Force_Direction) {
        if (!Entity_Movement_Forces.Possible_Directions.includes(forceDirection)) {
            throw new Error(`Force ${forceDirection} invalid`);
        }

        const existingComponent = this.directions_and_their_components[forceDirection].find(component => component.key === key);
        return existingComponent !== undefined;
    }
    applyFriction() {
        this.forEachComponent((component: Force_Component) => {
            component.forceValue *= (1 - this.entity.friction);
        });
        this.Remove_Components_That_Have_Their_Force_Values_Below_Threshold();
    }
    forEachComponent(doThis: (component: Force_Component) => void) {
        this.directions_and_their_components.up.forEach(doThis);
        this.directions_and_their_components.down.forEach(doThis);
        this.directions_and_their_components.right.forEach(doThis);
        this.directions_and_their_components.left.forEach(doThis);
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
        const filterFunc = (component: Force_Component) => component.forceValue > this.removeForceComponentWhenValueHitsBelow || component.keepAtZero;
        this.directions_and_their_components.up = this.directions_and_their_components.up.filter(filterFunc);
        this.directions_and_their_components.down = this.directions_and_their_components.down.filter(filterFunc);
        this.directions_and_their_components.right = this.directions_and_their_components.right.filter(filterFunc);
        this.directions_and_their_components.left = this.directions_and_their_components.left.filter(filterFunc);
    }


    Get_Keys_Of_Components_Of_A_Direction_That_Are_Not_Present_In_Another_Entity_Components_Of_Same_Direction(
        forceDirection: keyof Entity_Movement_Forces["directions_and_their_components"],
        anotherEntity: Base_Entity
    ): string[] {
        const forceAComponents = this.directions_and_their_components[forceDirection];
        const forceBComponents = anotherEntity.movementForces.directions_and_their_components[forceDirection];

        const forceBTags = new Set(forceBComponents.map((component) => component.key));

        return forceAComponents
            .filter((component) => !forceBTags.has(component.key))
            .map((component) => component.key);
    }


Get_Keys_Of_Force_Components_Of_Direction(
    direction: keyof Entity_Movement_Forces["directions_and_their_components"]
): string[] {
    const forceComponents = this.directions_and_their_components[direction];
    return forceComponents.map((component) => component.key);
}

nullify(direction: keyof Entity_Movement_Forces["directions_and_their_components"]) {
  this.directions_and_their_components[direction].forEach((forceComponent: Force_Component )=> {
    forceComponent.forceValue = 0;
  })
}
nullifyAll() {
  this.nullify("up")
  this.nullify("down")
  this.nullify("left")
  this.nullify("right")
}

Receive_Force_Components_Of_A_Direction_From_Another_Entity_That_Are_Not_Already_Present(direction: keyof Entity_Movement_Forces["directions_and_their_components"], anotherEntity: Base_Entity) {
  const neededKeys = anotherEntity.movementForces.Get_Keys_Of_Components_Of_A_Direction_That_Are_Not_Present_In_Another_Entity_Components_Of_Same_Direction(direction, this.entity);

  neededKeys.forEach(key=>{
    const component =     anotherEntity.movementForces.Get_Direction_Component_By_Key(key, direction);
    this.Set_Component(key, direction, component.forceValue, component.keepAtZero);
  })
}
}