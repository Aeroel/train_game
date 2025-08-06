export { AssertThat }

function AssertThat(condition: unknown,): asserts condition {
  if (!condition) throw new Error(`Assertion failed! `);
}