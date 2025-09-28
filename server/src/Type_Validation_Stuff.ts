import type { Base_Entity } from "#root/Entities/Base_Entity.js";

export {
  Assert_That_Number_Is_Finite,
  Assert_That_Numbers_Are_Finite,
  
  Assert_That_Number_Is_Zero_Or_Positive,
  Assert_That_Numbers_Are_Zero_Or_Positive,

  Assert_That,
  isNumberFinite
}



function isNumberFinite(value: number): boolean {
  const answer = (typeof value === 'number' && Number.isFinite(value));
  return answer;
}


function Assert_That_Number_Is_Finite(num: number) {
  if (!isNumberFinite(num)) {
    throw new Error(`${num} must be a finite (non-Inifinity non-NaN) but ${num} given`);
  }
}


function Assert_That_Number_Is_Zero_Or_Positive(num: number) {
  const itIs = isNumberFinite(num) && num >= 0;
  if (!itIs) {
    throw new Error(`Value must be a zero or positive number, but  ${typeof num} ${JSON.stringify(num)} given`);
  }
}
function Assert_That_Numbers_Are_Finite(nums: Record<string, any>) {
  const invalidEntries: string[] = [];

  Object.entries(nums).forEach(([name, value]) => {
    if (!isNumberFinite(value)) {
      invalidEntries.push(`${name}: ${JSON.stringify(value)} (type ${typeof value})`);
    }
  });

  if (invalidEntries.length > 0) {
    throw new Error(`All numbers must be finite. Invalid values:\n${invalidEntries.join('\n')}`);
  }
}
function Assert_That_Numbers_Are_Zero_Or_Positive(nums: Record<string, any>) {
  const invalidEntries: string[] = [];

  Object.entries(nums).forEach(([name, num]) => {
    const isIt = isNumberFinite(num) && num >= 0;
    if (!isIt) {
      invalidEntries.push(`${name}: ${JSON.stringify(num)} (type ${typeof num})`);
    }
  });

  if (invalidEntries.length > 0) {
    throw new Error(`Numbers must be positive or zero. Invalid values:\n${invalidEntries.join('\n')}`);
  }
}
function Assert_That(someConditionEvaluatesToTrue: boolean, message: string) {
  if (!(typeof someConditionEvaluatesToTrue === "boolean")) {
    throw new Error(`Parameter to Assert_That() must evaluate to true or false`);
  }
  if (someConditionEvaluatesToTrue === false) {
    throw new Error(`Assertion violated with message: ${message}`);
  }
}