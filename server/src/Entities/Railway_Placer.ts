export interface Railway_Placer_Required_Inputs {
       x: number, y: number, railLength: number, switchGapLength: number, carSquareSize: number, switchWallThickness: number, switchWallLength: number
     }
 export type Pair_Of_Rails =  {
   railA: Rail,
   railB: Rail
 }
 import { Rail } from "#root/Entities/Train_Stuff/Rail.js"
 import type { Direction } from "#root/Type_Stuff.js"

export class Railway_Placer {
  constructor({
       x, y, railLength, switchGapLength, carSquareSize, switchWallThickness, switchWallLength
     }: Railway_Placer_Required_Inputs) {
     
  }
  placeFirstPairOfRails(direction: Direction): Pair_Of_Rails {
    // placeholder return statement
    return {railA: new Rail(), railB: new Rail()}
  }
  
  
  placeNextTo(pair: Pair_Of_Rails, direction: Direction): Pair_Of_Rails {
    // placeholder return statement
    return {railA: new Rail(), railB: new Rail()}
  }
  
  
  placeUturnRails(pair: Pair_Of_Rails) {
    
  }
  generateRailSwitchWalls() {
    
  }
}