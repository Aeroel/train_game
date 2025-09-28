type Log_Category = string;
let loggingEnabled = false; // flip to false to disable all logs
let newLoggingEnabled = true;

const logCategories: {categoryName:Log_Category, loggingEnabled: boolean}[] = [
  {categoryName:"World_Tick", loggingEnabled: true},
  ];

export function log(...args: any) {
  if(!loggingEnabled) {
    return
  }
  console.log(...args);
}
export function newLog({logCategory, message} : {logCategory: Log_Category, message: string}) {
  if (!newLoggingEnabled) {
    return;
  }
  if(!categoryExists(logCategory)){
    throw new Error(`Cannot find category '${logCategory}' in the list of possible log categories`)
  } 
  if(!categoryHasLoggingEnabled(logCategory)) {
    return;
  }
    console.log(`[${logCategory}]: ${message}`);
}


function categoryExists(catName: Log_Category) : boolean {
  
  return getAllCatNames().includes(catName);
}
 function getAllCatNames() {
   const allCatNames: Log_Category[] =[];
  for(const lc of logCategories) {
    allCatNames.push(lc.categoryName);
  }
  return allCatNames;
 }
function categoryHasLoggingEnabled(cat: Log_Category) : boolean {
  const lc = logCategories.find(lc=>lc.categoryName === cat) 
  if(!lc) {
    return false 
    
  }
  return lc.loggingEnabled;
}