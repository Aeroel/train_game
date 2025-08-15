import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
import { Assert } from "#root/Assert.js";
import {
    Assert_That_Number_Is_Zero_Or_Positive,
    Assert_That_Numbers_Are_Finite,
    Assert_That_Numbers_Are_Zero_Or_Positive
} from "#root/Type_Validation_Stuff.js";

export type Force_Component = {
    key: string;
    forceValue: number;
};

export type Directions_Force_Components = {
    up: Force_Component[];
    down: Force_Component[];
    right: Force_Component[];
    left: Force_Component[];
};

export type Directions_Values = {
    up: number;
    down: number;
    right: number;
    left: number;
};

export type Force_Direction = Direction;

export { Entity_Movement_Forces };

class Entity_Movement_Forces {
    entity: Base_Entity;
    private propagationList: Base_Entity[] = [];
    static readonly Possible_Directions: Force_Direction[] = ["up", "down", "left", "right"];
    directions_and_their_components: Directions_Force_Components = {
        up: [],
        down: [],
        right: [],
        left: [],
    };

    constructor(ofEntity: Base_Entity) {
        this.entity = ofEntity;
    }

    // ----------------- Utility Methods -----------------
    Get_Opposite_Force_Direction(to: Force_Direction): Force_Direction {
        const mapping: Record<Force_Direction, Force_Direction> = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };
        return mapping[to];
    }

    Get_No_Movement_Forces(): Directions_Values {
        return { up: 0, down: 0, right: 0, left: 0 };
    }

    Component_Exists_In_Direction(key: string, dir: Force_Direction): boolean {
        if (!Entity_Movement_Forces.Possible_Directions.includes(dir)) {
            throw new Error(`Force direction ${dir} is invalid`);
        }
        return this.directions_and_their_components[dir].some(c => c.key === key);
    }

    // ----------------- Component Accessors -----------------
    Get_Direction_Component_By_Key(key: string, dir: Force_Direction): Force_Component {
        const component = this.directions_and_their_components[dir].find(c => c.key === key);
        if (!component) {
            throw new Error(`${key} not found in ${dir}. ${JSON.stringify(this.entity.tags)}`);
        }
        return component;
    }

    Get_A_Component_From_Each_Direction_By_Key(key: string): Directions_Values {
        const result: Directions_Values = {
            up: this.Get_Direction_Component_By_Key(key, "up").forceValue,
            down: this.Get_Direction_Component_By_Key(key, "down").forceValue,
            left: this.Get_Direction_Component_By_Key(key, "left").forceValue,
            right: this.Get_Direction_Component_By_Key(key, "right").forceValue,
        };

        Assert_That_Numbers_Are_Finite(result);
        Assert_That_Numbers_Are_Zero_Or_Positive(result);

        return result;
    }

    Get_Keys_Of_Force_Components_Of_Direction(dir: Force_Direction): string[] {
        return this.directions_and_their_components[dir].map(c => c.key);
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

    // ----------------- Component Setters -----------------
    Set_Component(key: string, dir: Force_Direction, value: number) {
        Assert_That_Number_Is_Zero_Or_Positive(value);

        // Propagate first
        this.propagationList.forEach(entity => {
            entity.movementForces.Set_Component(key, dir, value);
        });

        const existing = this.directions_and_their_components[dir].find(c => c.key === key);
        if (existing) {
            existing.forceValue = value;
        } else {
            this.directions_and_their_components[dir].push({ key, forceValue: value });
        }
    }

    Set_A_Component_For_Each_Direction_By_Same_Key(key: string, values: Directions_Values) {
        Entity_Movement_Forces.Possible_Directions.forEach(dir => {
            this.Set_Component(key, dir, values[dir]);
        });
    }

    Init_A_Component_With_Same_Key_For_Each_Direction(key: string) {
        this.Set_A_Component_For_Each_Direction_By_Same_Key(key, this.Get_No_Movement_Forces());
    }

    sumComponents(dir: Force_Direction): number {
        return this.directions_and_their_components[dir].reduce((acc, c) => acc + c.forceValue, 0);
    }

    Get_Net_Axis_Force(axis: "horizontal" | "vertical"): number {
        switch (axis) {
            case "horizontal":
                return this.sumComponents("right") - this.sumComponents("left");
            case "vertical":
                return this.sumComponents("down") - this.sumComponents("up");
        }
    }

    // ----------------- Propagation List -----------------
    Get_Propagation_List(): Base_Entity[] {
        return [...this.propagationList];
    }

Clear_Propagation_List() {
    for (const entity of this.propagationList) {
        // Remove all components of this entity from the linked entity
        for (const dir of Entity_Movement_Forces.Possible_Directions as Force_Direction[]) {
            for (const comp of this.directions_and_their_components[dir]) {
                entity.movementForces.removeByKeyInAllDirections(comp.key);
            }
        }
    }

    // Now safe to clear
    this.propagationList = [];
}


    Add_Entity_To_Propagation_List(entity: Base_Entity) {
        if (entity.movementForces.propagationList.includes(this.entity)) {
            throw new Error(`Circular propagation detected: ${entity} already propagates to ${this.entity}`);
        }
        if (!this.propagationList.includes(entity)) {
            this.propagationList.push(entity);
        }
    }

    // ----------------- Removal -----------------
    removeByKeyInAllDirections(key: string, visited = new Set<Base_Entity>()) {
        if (visited.has(this.entity)) {
            throw new Error("Circular propagation detected while removing component");
        }
        visited.add(this.entity);

        // Remove from propagation entities first
        this.propagationList.forEach(entity => {
            entity.movementForces.removeByKeyInAllDirections(key, visited);
        });

        // Remove locally
        Entity_Movement_Forces.Possible_Directions.forEach(dir => {
            this.directions_and_their_components[dir] = this.directions_and_their_components[dir].filter(c => c.key !== key);
        });
    }

    remove(dir: Force_Direction) {
        // Remove components from propagation first
        this.propagationList.forEach(entity => {
            entity.movementForces.remove(dir);
        });

        this.directions_and_their_components[dir] = [];
    }

    removeAll() {
        Entity_Movement_Forces.Possible_Directions.forEach(dir => this.remove(dir));
    }

    // ----------------- Iteration -----------------
    forEachComponent(doThis: (component: Force_Component) => void) {
        Entity_Movement_Forces.Possible_Directions.forEach(dir => {
            this.directions_and_their_components[dir].forEach(c => doThis(c));
        });
    }

    Receive_Force_Components_Of_A_Direction_From_Another_Entity_That_Are_Not_Already_Present(
        dir: Force_Direction,
        other: Base_Entity
    ) {
        const keys = other.movementForces.Get_Keys_Of_Components_Of_A_Direction_That_Are_Not_Present_In_Another_Entity_Components_Of_Same_Direction(
            dir,
            this.entity
        );

        keys.forEach(key => {
            const component = other.movementForces.Get_Direction_Component_By_Key(key, dir);
            this.Set_Component(key, dir, component.forceValue);
        });
    }
}