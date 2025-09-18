function are(directions, triggersUponContactWithCarIf) {
  if (directions === null || triggersUponContactWithCarIf === null) {
    throw new Error("Inputs cannot be null");
  }

  // check for duplicates
  const hasDuplicates = arr => new Set(arr).size !== arr.length;
  if (hasDuplicates(directions)) {
    throw new Error("Directions input contains duplicates — corrupted data");
  }
  if (hasDuplicates(triggersUponContactWithCarIf)) {
    throw new Error("Triggers input contains duplicates — corrupted data");
  }

  // compare sets
  const setA = new Set(directions);
  const setB = new Set(triggersUponContactWithCarIf);
 let identical = true;
  if (setA.size !== setB.size) {identical = false;}

  for (let dir of setA) {
    if (!setB.has(dir)) {identical = false;}
  }
   console.log("????", triggersUponContactWithCarIf, directions, identical)
  return identical;
}
    let one = ["right", "up"];
    let two = ["up"];
    are(one, two)
     one = [ "up"];
    two = ["up","right"];
    are(one, two)
     one = ["down", "up"];
     two = ["up"];
    are(one, two)
     one = [ "up"];
     two = ["up"];
    are(one, two)