import { Entity } from "../Entity.js";

export { Rail }
class Rail extends Entity {
    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple")
        this.defaultInitialOrientationValue='horizontal'
        this.orientation = this.defaultInitialOrientationValue;
    }
    setWidth(width) {
        super.setWidth(width);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    setHeight(height) {
        super.setHeight(height);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
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