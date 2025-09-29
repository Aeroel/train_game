import {newLog} from "#root/My_Log.js"

export class Stopwatch {
   startTime=0;
   totalLapsTime=0;
   tags: string[] = [];
   constructor() {
    this.totalLapsTime = 0;
  }
    beginMeasure({tags}: {tags: string[]}) {
    this.startTime = this.getCurrentTimeInMs();
     this.tags = tags;
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
    let tagsStr = ``;
   for(const tag of this.tags) {
     if(tag===this.tags[0]) continue;
     tagsStr = `${tagsStr} [${tag}] `
   }
    newLog({
      message:`${tagsStr} Took ${this.lap()} ms`,
      logCategory: this.tags[0]
    })
  }
}