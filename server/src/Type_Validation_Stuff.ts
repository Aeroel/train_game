import type { Base_Entity } from "#root/Entities/Base_Entity.js";

export {
  Assert_That_Number_Is_Finite,
  Assert_That_Numbers_Are_Finite,
  Assert_That_Numbers_Are_Positive_Or_Zero as Assert_That_Numbers_Are_Positive,
  Assert_That_Number_Is_Positive,
  Assert_That,
  isNumberFinite
}



function isNumberFinite(value: number): boolean {
  return (typeof value === 'number' && Number.isFinite(value));
}
function Assert_That_Number_Is_Finite(num: number) {
  if (!isNumberFinite(num)) {
    throw new Error(`${num} must be a finite (non-Inifinity non-NaN) but ${num} given`);
  }
}
function Assert_That_Number_Is_Positive(num: number) {
  if (!isNumberFinite(num) || num < 0) {
    throw new Error(`Value must be a positive number, but  ${typeof num} ${JSON.stringify(num)} given`);
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
function Assert_That_Numbers_Are_Positive_Or_Zero(nums: Record<string, any>) {
  const invalidEntries: string[] = [];

  Object.entries(nums).forEach(([name, value]) => {
    if (!isNumberFinite(value) || !(value >= 0)) {
      invalidEntries.push(`${name}: ${JSON.stringify(value)} (type ${typeof value})`);
    }
  });

  if (invalidEntries.length > 0) {
    throw new Error(`Number must be positive or zero. Invalid values:\n${invalidEntries.join('\n')}`);
  }
}
function Assert_That(trueOrFalse: boolean) {
  if (!(typeof trueOrFalse === "boolean")) {
    throw new Error(`Parameter to Assert_That() must evaluate to true or false`);
  }
  if (trueOrFalse === false) {
    throw new Error(`Assertion violated`);
  }
}