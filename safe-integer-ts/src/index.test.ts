import { deepStrictEqual as assertEq } from "assert"
import {
  SafeInteger,
  asSafeInteger,
  isSafeInteger,
  toSafeInteger,
  parseSafeInteger,
} from "."

// Provided by mocha.
declare const describe: (title: string, body: () => void) => void
declare const it: (title: string, testFn: () => void) => void

const testMain = () => {
  // No need to test an alias of standard function.
  // describe("isSafeInteger", () => {})

  describe("asSafeInteger", () => {
    it("no-op for small safe-integers", () => {
      assertEq(asSafeInteger(1), 1 as SafeInteger)
      assertEq(asSafeInteger(0), 0 as SafeInteger)
      assertEq(asSafeInteger(-1), -1 as SafeInteger)
    })

    it("no-op for extreme safe-integers", () => {
      assertEq(asSafeInteger(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER as SafeInteger)
      assertEq(asSafeInteger(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER as SafeInteger)
    })

    it("null for NaN", () => {
      assertEq(asSafeInteger(NaN), null)
    })

    it("null for strings", () => {
      assertEq(asSafeInteger(""), null)
      assertEq(asSafeInteger("1"), null)
    })

    it("null for objects", () => {
      assertEq(asSafeInteger({}), null)
      assertEq(asSafeInteger(new Date()), null)
    })
  })

  describe("parseSafeInteger", () => {
    it("works for small integers", () => {
      assertEq(parseSafeInteger("1"), 1 as SafeInteger)
      assertEq(parseSafeInteger("0"), 0 as SafeInteger)
      assertEq(parseSafeInteger("-1"), -1 as SafeInteger)
    })

    it("works for extreme safe-integers", () => {
      assertEq(9007199254740991, Number.MAX_SAFE_INTEGER)
      assertEq(parseSafeInteger("9007199254740991"), 9007199254740991 as SafeInteger)

      assertEq(-9007199254740991, Number.MIN_SAFE_INTEGER)
      assertEq(parseSafeInteger("-9007199254740991"), -9007199254740991 as SafeInteger)
    })

    // same as parseInt
    it("trims leading/trailing spaces", () => {
      assertEq(parseSafeInteger(" 1 "), 1 as SafeInteger)
      assertEq(parseSafeInteger("\r\n\t -1 \t\r\n"), -1 as SafeInteger)
    })

    // same as parseInt
    it("returns integer for non-integer input (unfortunately)", () => {
      assertEq(parseSafeInteger("3.14"), 3 as SafeInteger)
      assertEq(parseSafeInteger("1e9+7"), 1 as SafeInteger)
    })

    // same as parseInt
    it("returns null for invalid string", () => {
      assertEq(parseSafeInteger(""), null)
      assertEq(parseSafeInteger("."), null)
      assertEq(parseSafeInteger("-"), null)
      assertEq(parseSafeInteger("deadbeef"), null)
    })

    // same as parseInt
    it("works for non-decimal inputs when radix specified", () => {
      assertEq(parseSafeInteger("deadbeef", 16), 0xdeadbeef as SafeInteger)
    })
  })

  describe("toSafeInteger", () => {
    it("no-op for safe-integer", () => {
      assertEq(toSafeInteger(0), 0 as SafeInteger)
      assertEq(toSafeInteger(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER as SafeInteger)
      assertEq(toSafeInteger(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER as SafeInteger)
    })

    it("rounds non-integer numbers", () => {
      assertEq(toSafeInteger(0.999), 1 as SafeInteger)
      assertEq(toSafeInteger(3.14), 3 as SafeInteger)
    })

    it("null for infinity", () => {
      assertEq(toSafeInteger(Number.POSITIVE_INFINITY), null)
      assertEq(toSafeInteger(Number.NEGATIVE_INFINITY), null)
    })

    it("parse string", () => {
      assertEq(toSafeInteger("1"), 1 as SafeInteger)
    })

    it("call valueOf", () => {
      const obj = {
        inner: 1,
        valueOf() {
          return this.inner
        },
      }

      assertEq(toSafeInteger(obj), 1 as SafeInteger)
    })

    it("null for object with non-function valueOf", () => {
      assertEq(toSafeInteger({ valueOf: 0 }), null)
    })

    it("null for objects without valueOf", () => {
      assertEq(toSafeInteger(null), null)
      assertEq(toSafeInteger({}), null)
      assertEq(toSafeInteger(Object.create(null)), null)
    })

    it("null for undefined", () => {
      assertEq(toSafeInteger(undefined), null)
    })

    it("null for boolean", () => {
      assertEq(toSafeInteger(false), null)
      assertEq(toSafeInteger(true), null)
    })
  })

  // type check only
  describe("Example in README", () => {
    const unknownValue: unknown = JSON.parse("42")

    // As argument.
    const useSafeInteger = (_value: SafeInteger) => {
      // No need to validate in case of non-integer, NaN, integer-like string, etc.
    }

    // Validate.
    {
      if (isSafeInteger(unknownValue)) {
        useSafeInteger(unknownValue)
      }
    }

    // Cast.
    {
      const value: SafeInteger | null = asSafeInteger(unknownValue)
      if (value != null) {
        useSafeInteger(value)
      }
    }

    // Convert.
    {
      const value: SafeInteger | null = toSafeInteger("42")
      if (value != null) {
        useSafeInteger(value)
      }
    }
  })
}

testMain()
