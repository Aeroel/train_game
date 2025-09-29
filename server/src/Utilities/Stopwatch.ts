import {newLog} from "#root/My_Log.js"

export class Stopwatch {
   startTime=0;
   totalLapsTime=0;
   tags: string[] = [];
   measurements:{ms: number, tags: string[]}[]=[];
   constructor() {
    this.totalLapsTime = 0;
  }
    beginMeasure({tags}: {tags: string[]}) {
    this.startTime = this.getCurrentTimeInMs();
     this.tags = tags;
  }
  countMeasurements() {
    return this.measurements.length;
  }
  getMeasurements() {
    return this.measurements;
  }
   lap() {
    const currTime = this.getCurrentTimeInMs();
    const elapsed = currTime - this.startTime;
    this.totalLapsTime += elapsed;
    return elapsed;
  }
   getCurrentTimeInMs() {
    return Date.now();
  }
   total() {
    return this.totalLapsTime;
  }
   endMeasure() {
     this.measurements.push({
       ms:this.lap(),
       tags: this.tags,
     })
  }
}