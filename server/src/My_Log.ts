
let loggingEnabled = true; // flip to false to disable all logs

export function log(...args: any[]) {
  if (!loggingEnabled) {
    return;
  }
    console.log(...args);
}