import { Collision_Stuff } from "../Collision_Stuff.js";
import { World } from "../World.js";

export { Train_Car_Behaviour };


class Train_Car_Behaviour {
    /*
          when a train touches station stop spot, it slows down and stops. It waits for 5 seconds before continuing to move it same direction as before.
     */

    behaviour() {

        const spotOrNull = this.Get_Touching_Stop_Spot();
        if (!(spotOrNull === null) && !(spotOrNull === this.lastSpot)) {
            this.Pause_Movement();
            this.Open_Doors();
            this.lastSpot = spotOrNull;
            this.Is_Waiting_For_Five_Seconds = true;
        }
        if (this.Is_Waiting_For_Five_Seconds && this.Did_Five_Seconds_Pass()) {
            this.Close_Doors();
            this.Continue_Moving();
            this.Is_Waiting_For_Five_Seconds = false;
        }


    }

    Pause_Movement() {
        this.storedMovementDirection = this.currentMovementDirection;
        this.pauseBegunAt = Date.now();
        this.currentMovementDirection = null;

    }

    Did_Five_Seconds_Pass() {
        const currTimestamp = Date.now();
        const answer = (currTimestamp > ((5 * 1000) + this.pauseBegunAt));
        return answer;
    }

    Continue_Moving() {
        this.currentMovementDirection = this.storedMovementDirection;
        this.Is_Waiting_For_Five_Seconds = false;
    }
    Get_Touching_Stop_Spot() {
        let spotOrNull = null;
        World.getCurrentEntities().forEach(entity => {
            if (this === entity) {
                return null;
            }
            if (!entity.hasTag("Station_Stop_Spot")) {
                return null;

            }
            if (!Collision_Stuff.areEntitiesTouching(this, entity)) {
                return null;

            }
            spotOrNull = entity;
        });
        return spotOrNull;
    }

    Open_Doors() {
        this.Doors_Must_Be_Skipped = true;
        this.saved_sideADoorA_X = this.walls.entranceSideADoorA.x;
        this.saved_sideADoorA_Y = this.walls.entranceSideADoorB.y;

        this.saved_sideBDoorA_X = this.walls.entranceSideBDoorA.x;
        this.saved_sideBDoorA_Y = this.walls.entranceSideBDoorB.y;

        if (this.currentRail.orientation === 'horizontal') {
            this.walls.entranceSideADoorA.setX(this.walls.entranceSideAWallA.x);
            this.walls.entranceSideADoorA.setY(this.walls.entranceSideAWallA.y - this.wallThickness);

            this.walls.entranceSideADoorB.setX(this.walls.entranceSideAWallB.x);
            this.walls.entranceSideADoorB.setY(this.walls.entranceSideAWallB.y - this.wallThickness);


            // bottom

            this.walls.entranceSideBDoorA.setX(this.walls.entranceSideBWallA.x);
            this.walls.entranceSideBDoorA.setY(this.walls.entranceSideBWallA.y + this.wallThickness);

            this.walls.entranceSideBDoorB.setX(this.walls.entranceSideBWallB.x);
            this.walls.entranceSideBDoorB.setY(this.walls.entranceSideBWallB.y + this.wallThickness);
        } else if (this.currentRail.orientation === 'vertical') {
            this.walls.entranceSideADoorA.setX(this.walls.entranceSideAWallA.x - this.wallThickness);
            this.walls.entranceSideADoorA.setY(this.walls.entranceSideAWallA.y);

            this.walls.entranceSideADoorB.setX(this.walls.entranceSideAWallB.x - this.wallThickness);
            this.walls.entranceSideADoorB.setY(this.walls.entranceSideAWallB.y);


            // right

            this.walls.entranceSideBDoorA.setX(this.walls.entranceSideBWallA.x + this.wallThickness);
            this.walls.entranceSideBDoorA.setY(this.walls.entranceSideBWallA.y - this.walls.entranceSideBDoorA.height);

            this.walls.entranceSideBDoorB.setX(this.walls.entranceSideBWallB.x + this.wallThickness);
            this.walls.entranceSideBDoorB.setY(this.walls.entranceSideBWallB.y + this.walls.entranceSideBDoorB.height);
        }
    }

    Close_Doors() {
        this.walls.entranceSideADoorA.x = this.saved_sideADoorA_X;
        this.walls.entranceSideADoorB.y = this.saved_sideADoorA_Y;
        this.walls.entranceSideBDoorA.x = this.saved_sideBDoorA_X;
        this.walls.entranceSideBDoorB.y = this.saved_sideBDoorA_Y;

        this.Doors_Must_Be_Skipped = false;
    }

}