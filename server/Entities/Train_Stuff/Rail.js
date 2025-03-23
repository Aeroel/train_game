import { Base_Entity } from "#root/Entities/Base_Entity.js";

export { Rail };
class Rail extends Base_Entity {
    //  left right is for hori, top bot is for vert
    railConnections = { firstEnd: null, secondEnd: null };
    twoPossibleEnds = ["firstEnd", "secondEnd"];
    defaultInitialOrientationValue = 'horizontal';
    orientation = this.defaultInitialOrientationValue;
    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple");
    }
    getFirstEnd() {
        switch (this.orientation) {
            case "vertical":
                return { x: this.getCenterX(), y: this.getCenterY() - (this.getHeight() / 2) };
                break;
            case "horizontal":
                return { x: this.getCenterX() - (this.getWidth() / 2), y: this.getCenterY() };
                break;
        }
    }
    getEnd(name) {
        if (name === 'secondEnd') {
            return this.getSecondEnd();
        }
        return this.getFirstEnd();
    }
    getSecondEnd() {
        switch (this.orientation) {
            case "vertical":
                return { x: this.getCenterX(), y: this.getCenterY() + (this.getHeight() / 2) };
                break;
            case "horizontal":
                return { x: this.getCenterX() + (this.getWidth() / 2), y: this.getCenterY() };
                break;
        }
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
    getOrientation() {
        return this.orientation;
    }

    getEnd(endType) {
        if (this.orientation === 'horizontal') {
            if (endType === 'secondEnd' || endType === 'rightEnd') {
                return { x: this.x + this.width, y: this.y };
            } else if (endType === 'firstEnd' || endType === 'leftEnd') {
                return { x: this.x, y: this.y };
            }
        } else if (this.orientation === 'vertical') {
            if (endType === 'secondEnd' || endType === 'bottomEnd') {
                return { x: this.x, y: this.y + this.height };
            } else if (endType === 'firstEnd' || endType === 'topEnd') {
                return { x: this.x, y: this.y };
            }
        }
         // Default (if no matching end type)
         throw new Error(`${endType} does not match any valid value...`);
    }
    getEndClosestTo(obj) {
        const centerOfObj = {
            x: obj.x + obj.width / 2,
            y: obj.y + obj.height / 2
        };

        const firstEnd = this.getFirstEnd();
        const secondEnd = this.getSecondEnd();

        const distanceToFirstEnd = Math.sqrt(
            Math.pow(centerOfObj.x - firstEnd.x, 2) +
            Math.pow(centerOfObj.y - firstEnd.y, 2)
        );

        const distanceToSecondEnd = Math.sqrt(
            Math.pow(centerOfObj.x - secondEnd.x, 2) +
            Math.pow(centerOfObj.y - secondEnd.y, 2)
        );

        let closestEnd;

        if (distanceToFirstEnd < distanceToSecondEnd) {
            closestEnd = firstEnd;
            closestEnd.rail = this.railConnections.firstEnd || null; // Get connected rail or null
            closestEnd.name = 'firstEnd';
        } else {
            closestEnd = secondEnd;
            closestEnd.rail = this.railConnections.secondEnd || null; // Get connected rail or null
            closestEnd.name = 'secondEnd';
        }

        return closestEnd;
    }

    findEndConnectedTo(anotherRail) {
        const firstEndConnected = (this.railConnections.firstEnd === anotherRail);
        const secondEndConnected = (this.railConnections.secondEnd === anotherRail);

        if (firstEndConnected && secondEndConnected) {
            throw new Error("Both ends are connected to the same rail.");
        }

        if (firstEndConnected) {
            return { ...this.getFirstEnd(), name: "firstEnd" };
        } else if (secondEndConnected) {
            return { ...this.getSecondEnd(), name: "secondEnd" };
        } else {
            return null; // No connection found
        }
    }

}