import type { Base_Entity } from "#root/Entities/Base_Entity.js";

export type Velocity_Component = {
    key: string,
    value: number,
};

export { Entity_Velocity };

class Entity_Velocity {
    entity: Base_Entity;
    private propagationList: Entity_Velocity[] = [];
    private components: Velocity_Component[] = [];

    constructor(ofEntity: Base_Entity) {
        this.entity = ofEntity;
    }

    Component_Exists(key: Velocity_Component['key']): boolean {
        return this.components.some(component => component.key === key);
    }

    Get_Component_By_Key(key: Velocity_Component['key']): Velocity_Component {
      if(!this.Component_Exists(key)) {
        throw new Error(`Could not find component keyed as ${key}. Component keys that are actually present: ${JSON.stringify(this.Get_Keys_Of_All_Components())}`)
      }
        const component = this.components.find(component => component.key === key);
        if(!component) {
          throw new Error("Component_Exists passed but still did not find")
        }
        return component;
    }

   Get_Keys_Of_All_Components() : Velocity_Component['key'][] {
  return this.components.map(component => component.key);
  }
  
   Get_Component_Keys_Present_In_This_Velocity_But_Not_In_Another(another: Entity_Velocity): Velocity_Component['key'][] {
        const keysInThis = new Set(this.components.map(component => component.key));
        const keysInAnother = new Set(another.components.map(component=> component.key));

        const difference = [...keysInThis].filter(key => !keysInAnother.has(key));
        return difference;
    }

    Add_Component(component: Velocity_Component) {
         const existingComponent = this.components.find(thisComponent => thisComponent.key === component.key);
    if (existingComponent) {
        existingComponent.value = component.value; // update value if component exists
    } else {
        this.components.push(component); // add new component if not exists
    }
            // Propagate to others
        this.propagationList.forEach(otherVelocity=> {
            otherVelocity.Add_Component(component);
        });
    }

    Sum_Of_Components(): number {
    const sum =  this.components.reduce(
      (sum, component) => sum + component.value,
      0);
      return sum;
    }

   get() {
     return this.Sum_Of_Components();
   }


    Get_Propagation_List(): Entity_Velocity[] {
        return [...this.propagationList];
    }
    Remove_From_Propagation_List(velocity: Entity_Velocity) {
          const index = this.propagationList.findIndex(foundVelocity => foundVelocity === velocity);
    if (index !== -1) {
        this.propagationList.splice(index, 1); // remove the component
    } else {
        throw new Error(`Velocity not found.`);
    }
    }

Clear_Propagation_List() {
    for (const velocity of this.propagationList) {
        // Remove all components from the linked entity velocity
            for (const component of velocity.components) {
                velocity.Remove_Component(component.key);
              }
    }

    // Now safe to clear
    this.propagationList = [];
}

   Add_To(velocity: Entity_Velocity) {
        this.components.forEach(component=> {
               velocity.Add_Component(component) 
        });
   }

    Add_To_Propagation_List(velocity: Entity_Velocity) {
        if (velocity.propagationList.includes(this)) {
            throw new Error(`Attempt to create a circular propagation detected.`);
        }
        if (!this.propagationList.includes(velocity)) {
            this.propagationList.push(velocity);
            this.Add_To(velocity);
        }
    }

nullify() {
  // alias for Remove_All_Components()
  this.Remove_All_Components();
}
Remove_All_Components(): void {
   const keysToRemove = this.components.map(component=>component.key);
    // Propagate removal of each key to others
    this.propagationList.forEach(velocity => {
        keysToRemove.forEach(key => velocity.Remove_Component(key));
    });
   // now remove locally
   this.components = [];
   
}
Remove_Component(key: Velocity_Component['key']) {
    // Remove from propagation entities first
    this.propagationList.forEach(velocity => {
        velocity.Remove_Component(key);
    });

    // implement Remove locally if found. if not found, do nothing except log to console
    const index = this.components.findIndex(component => component.key === key);
    if (index !== -1) {
        this.components.splice(index, 1); // remove the component
    } else {
        console.log(`Component with key "${key}" not found.`);
    }
}


    For_Each_Component_Do_This(doThis: (component: Velocity_Component) => void) {
        this.components.forEach(component => {
           // call the function passed
           doThis(component);
        });
    }

}