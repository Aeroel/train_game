import { Entity } from "../Entity.js";

export { Rail };
class Rail extends Entity {
    //  left right is for hori, top bot is for vert
    railConnections = { leftOrTop: null, rightOrBottom: null };
    defaultInitialOrientationValue = 'horizontal';
    orientation = this.defaultInitialOrientationValue;
    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple");
    }
    connectWithRail(thisEnd, otherEnd, otherRail) {
        this.railConnections[thisEnd] = otherRail;
        otherRail.railConnections[otherEnd] = this;
    }
    setWidth(width) {
        super.setWidth(width);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    setHeight(height) {
        super.setHeight(height);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    setOrientation(orientation) {
        this.orientation = orientation;
    }
    getOrientation() {
        return this.orientation;
    }

    getEnd(endType) {
        if (this.orientation === 'horizontal') {
            if (endType === 'rightEnd') {
                return { x: this.x + this.width, y: this.y };
            } else if (endType === 'leftEnd') {
                return { x: this.x, y: this.y };
            }
        } else if (this.orientation === 'vertical') {
            if (endType === 'bottomEnd') {
                return { x: this.x, y: this.y + this.height };
            } else if (endType === 'topEnd') {
                return { x: this.x, y: this.y };
            }
        }
        return { x: this.x, y: this.y };  // Default (if no matching end type)
    }
}