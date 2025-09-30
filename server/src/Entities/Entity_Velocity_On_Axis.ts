import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Entity_Velocity } from "#root/Entities/Entity_Velocity.js";
import  { newLog } from "#root/My_Log.js";
import  { Internal_Messaging } from "#root/Internal_Messaging.js";


export type Most_Freq = {entityName: string, components: Velocity_Component[]};

export type Velocity_Component = {
    key: string,
    value: number,
};

export type Axis = "x" | "y";

export { Entity_Velocity_On_Axis };

class Entity_Velocity_On_Axis {
     velocity: Entity_Velocity;
     axis: Axis ='x'; //<- "x" is meaningless default
     propagationList: Entity_Velocity_On_Axis[] = [];
     components: Velocity_Component[] = [];

    constructor(axis: Axis, velocity: Entity_Velocity) {
        this.axis=axis;
        this.velocity=velocity;
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
          throw new Error("Component_Exists() check passed but still could not find the actual component")
        }
        return component;
    }

   Get_Keys_Of_All_Components() : Velocity_Component['key'][] {
  return this.components.map(component => component.key);
  }

  
   Get_Component_Keys_Present_In_This_Velocity_But_Not_In_Another(another: Entity_Velocity_On_Axis): Velocity_Component['key'][] {
        const keysInThis = new Set(this.components.map(component => component.key));
        const keysInAnother = new Set(another.components.map(component=> component.key));

        const difference = [...keysInThis].filter(key => !keysInAnother.has(key));
        return difference;
    }

    Add_Component(component: Velocity_Component) {
const most = <undefined| Most_Freq>Internal_Messaging.getMessage('mostPopulatedVelocity');
if((!most) || this.components.length > most.components.length) {
  Internal_Messaging.send("mostPopulatedVelocity",{entityName: this.velocity.entity.constructor.name, components: this.components})
}

      // copy because otherwise... well, we basically assign same object to every entity
      const componentCopy = {...component};
         const existingComponent = this.components.find(thisComponent => thisComponent.key === component.key);
    if (existingComponent) {
        existingComponent.value = component.value; // update value if component exists
    } else {
        this.components.push(componentCopy); // add new component if not exists
    }
            // Propagate to others
        this.propagationList.forEach(otherVelocity=> {
            otherVelocity.Add_Component(componentCopy);
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


    Get_Propagation_List(): Entity_Velocity_On_Axis[] {
        return [...this.propagationList];
    }
    
    
    Remove_From_Propagation_List(velocity: Entity_Velocity_On_Axis) {
          const index = this.propagationList.findIndex(foundVelocity => foundVelocity === velocity);
    if (index === -1) {
        throw new Error(`Velocity not found.`);
       }
       // remove the entry
      this.propagationList.splice(index, 1);
      // remove all components of this vel from the to be removed vel   
       for (const thisComponent of this.components) {
         velocity.Remove_Component(thisComponent.key)
      }
      
    }


Clear_Propagation_List() {
 
    for (const velocity of this.propagationList) {
        for(const thisComponent of this.components) {
          velocity.Remove_Component(thisComponent.key)
        }
    }

    // Now safe to clear
    this.propagationList = [];
}

   Add_To(velocity: Entity_Velocity_On_Axis) {
        this.components.forEach(component=> {
               velocity.Add_Component(component) 
        });
   }

  Add_To_Propagation_List(velocity: Entity_Velocity_On_Axis) {
      if(velocity.axis !== this.axis) {
        throw new Error(`Trying to add a velocity for axis ${velocity.axis}  to this velocity of axis ${this.axis}. This might be because you mixed up variable names like this.velocity.y and this.velocity.x`)
      }
        if (velocity.propagationList.includes(this)) {
            throw new Error(`Attempt to create a circular propagation detected.`);
        }
        if (this.propagationList.includes(velocity)) {
            throw new Error('Trying to add a velocity to propagation list, but it already exists in it')
        }
        
            this.propagationList.push(velocity);
            this.Add_To(velocity);
  }

nullify() {
   this.components.forEach(component=>{
     component.value = 0;
   })
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
Remove_Component(key: Velocity_Component['key'] | {key: Velocity_Component['key']}) {
 const actualKey = typeof key === 'object' && key !== null && 'key' in key ? key.key : key;
   
    const index = this.components.findIndex(component => component.key === actualKey);
    if (index === -1) {
         return;
    }
    // Remove from propagation entities first
    this.propagationList.forEach(velocity => {
        velocity.Remove_Component(actualKey);
    });


    // remove the component
        this.components.splice(index, 1); 

}



}

function mostFreq(comps: Velocity_Component[]): {key: Velocity_Component['key'], frequency: number } {
    // Create a map to store key frequencies
    const frequencyMap = new Map<string, number>();
    
    // Iterate over the components to populate the frequency map
    for (const comp of comps) {
        const currentCount = frequencyMap.get(comp.key) || 0;
        frequencyMap.set(comp.key, currentCount + 1);
    }
    
    // Find the key with the highest frequency
    let mostFrequentKey = '';
    let maxCount = 0;
    
    frequencyMap.forEach((count, key) => {
        if (count > maxCount) {
            mostFrequentKey = key;
            maxCount = count;
        }
    });
    
    return {key: mostFrequentKey, frequency: maxCount};
}