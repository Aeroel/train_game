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
    name: Rail_End_Name
} & Position;

export type Rail_Orientation = "vertical" | "horizontal";


class Rail extends Base_Entity {
    //  left right is for hori, top bot is for vert

    twoPossibleEnds = ["firstEnd", "secondEnd"];
    defaultInitialOrientationValue: Rail_Orientation = 'horizontal';
    orientation: Rail_Orientation = this.defaultInitialOrientationValue;
    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple");
    }


    setWidth(width: number) {
        super.setWidth(width);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    
    
    setHeight(height: number) {
        super.setHeight(height);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
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
        throw new Error(`${endType} does not 
        match any valid value...`);
    }
    
    
    calculateDistance(point1: Point, point2: Point) {
        return Math.hypot(point1.x - point2.x, point1.y - point2.y);
    }


    getEndClosestTo(point: Point) {
        Assert_That_Numbers_Are_Finite({pointX: point.x, pointY: point.y});

        const firstEnd = this.getEnd("firstEnd");
        const secondEnd = this.getEnd("secondEnd");

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
            closestEnd = {name: 'firstEnd' as Rail_End_Name, x: firstEnd.x, y: firstEnd.y};

        } else if (distanceToFirstEnd > distanceToSecondEnd) {
            closestEnd = {name: 'secondEnd' as Rail_End_Name, x: secondEnd.x, y: secondEnd.y};
        } else {
            throw new Error("Hm? ");
        }

        return closestEnd;
    }

}