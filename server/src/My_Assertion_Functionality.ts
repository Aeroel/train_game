export { My_Assert }
function My_Assert(trueOrFalse: boolean, message: string) {
      if((trueOrFalse) === false) {
        throw new Error(`Assertion violated with message: ${message}`);
      }
}