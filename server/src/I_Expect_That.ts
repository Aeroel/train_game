import {My_Assert} from "#root/My_Assert.js"
const debug = false;

export function I_Expect_That(condition: unknown, msgOnFalse?: string): asserts condition{
  return My_Assert.that(condition, msgOnFalse)
}

type Expectation = {
  passed: boolean;
  description: string;
};

export function Add_Expectation(condition: boolean, description: string): Expectation {
  return {
    passed: condition,
    description,
  };
}

export function Verify_Expectations(...expectations: Expectation[]): void {
  const errorMsgs: string[] =[];
  let msg: string="default"
  expectations.forEach((exp, index) => {
    if (!exp.passed) {
          msg= `❌ Expectation ${index + 1} failed: ${exp.description}`;
        if(debug) console.error(msg);
                  errorMsgs.push(msg);
      
    } else {
      msg= `✅ Expectation ${index + 1} passed: ${exp.description}`;
    if(debug) console.log(msg);
    }
  });
  if(errorMsgs.length > 0) {
    const errMsgStr = errorMsgs.join(', next error message says: ');
    throw new Error(`Expectation error(s): ${errMsgStr}`)
  }
}

