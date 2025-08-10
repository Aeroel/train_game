export { Assert }

class Assert {
  static that(condition: unknown): asserts condition {
    if (!condition) throw new Error(`Assertion failed!`);
  }

  static notNull<T>(value: T | null | undefined): asserts value is T {
    if (value === null || value === undefined) {
      throw new Error(`Expected value to be not null or undefined, but got ${value}`);
    }
  }

  static isNull(value: unknown): asserts value is null | undefined {
    if (value !== null && value !== undefined) {
      throw new Error(`Expected value to be null or undefined, but got ${value}`);
    }
  }

  static equals<T>(actual: T, expected: T): asserts actual is T {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
  }
}
