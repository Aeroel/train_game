import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import type { Point, Position } from "#root/Type_Stuff.js";
import { Assert_That_Numbers_Are_Finite } from "#root/Type_Validation_Stuff.js";

export { Rail };

export type Rail_End_Name = "firstEnd" | "secondEnd";
export type Rail_End_Name_Alternative = Rail_End_Name | "topEnd" | "bottomEnd" | "leftEnd" | "rightEnd";
export type Rail_Connection = {
    firstEnd: Rail | null;
    secondEnd: Rail | null;
};
export type Rail_End = {
    name: Rail_End_Name,
    connectedRail: Rail | null
} & Position;
export type Rail_Orientation = "vertical" | "horizontal";
class Rail extends Base_Entity {
    //  left right is for hori, top bot is for vert
    railConnections: Rail_Connection = { firstEnd: null, secondEnd: null };
    twoPossibleEnds = ["firstEnd", "secondEnd"];
    defaultInitialOrientationValue: Rail_Orientation = 'horizontal';
    orientation: Rail_Orientation = this.defaultInitialOrientationValue;
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
    connectWithRail(thisEnd: Rail_End_Name_Alternative, otherEnd: Rail_End_Name_Alternative, otherRail: Rail) {
        let thisEndFinal: Rail_End_Name = "firstEnd";
        if(thisEnd === "bottomEnd") {
            thisEndFinal = "secondEnd";
        } else if (thisEnd === "topEnd") {
            thisEndFinal = "firstEnd";
        } else {
            thisEndFinal = thisEnd as Rail_End_Name;
        }
        
        let otherEndFinal: Rail_End_Name = "firstEnd";
        if(otherEnd === "bottomEnd") {
            otherEndFinal = "secondEnd";
        } else if (otherEnd === "topEnd") {
            otherEndFinal = "firstEnd";
        } else {
            otherEndFinal = otherEnd as Rail_End_Name;
        }
        this.railConnections[thisEndFinal] = otherRail;
        otherRail.railConnections[otherEndFinal] = this;
    }
    setWidth(width: number) {
        super.setWidth(width);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    setHeight(height: number) {
        super.setHeight(height);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    getOrientation() {
        return this.orientation;
    }

    getEnd(endType: Rail_End_Name | Rail_End_Name_Alternative) {
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
    calculateDistance(point1: Point, point2: Point) {
        return Math.hypot(point1.x - point2.x, point1.y - point2.y);
    }

    outOfTwoSidesGetOneClosestToSpecifiedEnd(frontSideXY: Point, backSideXY: Point, endName: Rail_End_Name) {
        const endInQuestion = this.getEnd(endName);

        const frontDistance = this.calculateDistance(frontSideXY, endInQuestion);
        const backDistance = this.calculateDistance(backSideXY, endInQuestion);

        return frontDistance <= backDistance ? "frontSide" : "backSide";
    }

    getEndClosestTo(point: Point) {
        Assert_That_Numbers_Are_Finite({pointX: point.x, pointY: point.y});

        const firstEnd = this.getFirstEnd();
        const secondEnd = this.getSecondEnd();

        const distanceToFirstEnd = Math.sqrt(
            Math.pow(point.x - firstEnd.x, 2) +
            Math.pow(point.y - firstEnd.y, 2)
        );

        const distanceToSecondEnd = Math.sqrt(
            Math.pow(point.x - secondEnd.x, 2) +
            Math.pow(point.y - secondEnd.y, 2)
        );


        let closestEnd: Rail_End;

        if (isNaN(distanceToFirstEnd) || isNaN(distanceToSecondEnd)) {
            throw new Error(`DTFE and DTSE must be numbers, one or both are NaN`);
        }
        if (distanceToFirstEnd < distanceToSecondEnd) {
            closestEnd = {name: 'firstEnd' as Rail_End_Name, x: firstEnd.x, y: firstEnd.y, connectedRail: this.railConnections.firstEnd || null};

        } else if (distanceToFirstEnd > distanceToSecondEnd) {
            closestEnd = {name: 'secondEnd' as Rail_End_Name, x: secondEnd.x, y: secondEnd.y, connectedRail: this.railConnections.secondEnd || null};
        } else {
            throw new Error("Hm? ");
        }

        return closestEnd;
    }

    findEndConnectedTo(anotherRail: Rail) {
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