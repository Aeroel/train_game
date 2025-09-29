import {newLog} from "#root/My_Log.js"

export class Stopwatch {
  static startTime=0;
  static totalLapsTime=0;
  static tags: string[] = [];
  static start() {
    this.totalLapsTime = 0;
  }
   static beginMeasure({tags}: {tags: string[]}) {
    this.startTime = this.getCurrentTimeInMs();
     this.tags = tags;
  }
  static lap() {
    const currTime = this.getCurrentTimeInMs();
    const elapsed = currTime - this.startTime;
    this.totalLapsTime += elapsed;
    return elapsed;
  }
  static getCurrentTimeInMs() {
    return Date.now();
  }
  static total() {
    return this.totalLapsTime;
  }
  static endMeasure() {
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