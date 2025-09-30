type Log_Category = string;
export type New_Log_Input = {
  logCategory?: Log_Category, 
  logCategories?: Log_Category[], 
  message: string
  
}

let loggingEnabled = false; // flip to false to disable all logs
let newLoggingEnabled = true;

const logCategories: {categoryName:Log_Category, loggingEnabled: boolean}[] = [
  {categoryName:"World_Tick", loggingEnabled: false},
  {categoryName:"Planet", loggingEnabled: false},
  {categoryName:"Train_Car", loggingEnabled: false},
  {categoryName:"Rail_Switch_Wall", loggingEnabled: false},
  {categoryName:"Entity_Velocity", loggingEnabled: true},
  
  ];

export function log(...args: any) {
  if(!loggingEnabled) {
    return
  }
  console.log(...args);
}
export function newLog(input : New_Log_Input) {
  validateInput(input);
  const {logCategory = '', logCategories = [], message} = input;
  if (!newLoggingEnabled) {
    return;
  }
if(logCategories.length===0) {
    if(!categoryExists(logCategory)){
    throw new Error(`Cannot find category '${logCategory}' in the list of possible log categories`)
  } 
  if(!categoryHasLoggingEnabled(logCategory)) {
    return;
  }
} else if(logCategories.length > 0) {
  for (const lc of logCategories) {
      if(!categoryExists(lc)){
    throw new Error(`Cannot find category '${lc}' in the list of possible log categories`)
  } 
  if(!categoryHasLoggingEnabled(lc)) {
    return;
  }
  }
}
    console.log(`[${logCategory}] ${message}`);
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

function validateInput(input: New_Log_Input): void {
    // Type guard for message
    if (typeof input.message !== 'string' || input.message.trim() === '') {
        throw new Error('Message is required and must be a non-empty string');
    }

    // Validate logCategory if provided
    if (input.logCategory !== undefined) {
        if (typeof input.logCategory !== 'string' || input.logCategory.trim() === '') {
            throw new Error('logCategory must be a non-empty string');
        }
    }

    // Validate logCategories if provided
    if (input.logCategories !== undefined) {
        if (!Array.isArray(input.logCategories)) {
            throw new Error('logCategories must be an array');
        }

        for (const category of input.logCategories) {
            if (typeof category !== 'string' || category.trim() === '') {
                throw new Error('All logCategories must be non-empty strings');
            }
        }
    }

    // Ensure only one category type is provided
    if (input.logCategory !== undefined && input.logCategories !== undefined) {
        throw new Error('Cannot specify both logCategory and logCategories');
    }
}
