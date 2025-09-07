import {My_Assert} from "#root/My_Assert.js"

export function I_Expect_That(condition: unknown, msgOnFalse?: string): asserts condition{
  return My_Assert.that(condition, msgOnFalse)
}