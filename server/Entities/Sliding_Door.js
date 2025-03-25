import { Base_Entity } from "#root/Entities/Base_Entity.js";

export { Sliding_Door };

class Sliding_Door extends Base_Entity {
    color = "blue";
    possibleStates = ['closed', 'closing', 'opened', 'opening'];
    state = 'closed';
    Possible_Sliding_Open_Directions = ['right', 'left', 'up', 'down'];
    Which_Direction_The_Door_Slides_When_Opening;
    constructor(Sliding_Open_Direction) {
        super();
        this.forces.Sliding_Key = `Sliding`;
        this.forces.Init_A_Key_For_Each_Force(this.forces.Sliding_Key);

        if (!this.Possible_Sliding_Open_Directions.includes(Sliding_Open_Direction)) {
            throw new Error(`Invalid opening direction "${Sliding_Open_Direction}". `);
        }
        this.Which_Direction_The_Door_Slides_When_Opening = Sliding_Open_Direction;
    }
    updateState() {

        super.updateState();
    }
    getState() {
        return this.state;
    }
    setState(state) {
        if (!this.possibleStates.includes(state)) {
            throw new Error(`Invalid state ${state} given`);
        }
        this.state = state;
    }
    open() {
        if (!this.getState() === 'opening') {
            this.setState('opening');
            this.forces.setAll(this.forces.Sliding_Key, this.forces.Get_No_Movement_Forces());
            this.forces.set(this.forces.Sliding_Key, this.Which_Direction_The_Door_Slides_When_Opening, 10);
            return;
        }
        this.forces.set(this.forces.Sliding_Key, this.Which_Direction_The_Door_Slides_When_Opening, 10);
        
    }
    close() {

    }
}