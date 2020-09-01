/**
 * A number, which is validated as *safe-integer* or 53-bit precise integer.
 *
 * @see [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)
 */
export type SafeInteger = number & { [IS_SAFE_INTEGER]: true }

declare const IS_SAFE_INTEGER: unique symbol

/**
 * Checks if an unknown value is safe-integer without any conversion.
 */
export const isSafeInteger = Number.isSafeInteger as (value: unknown) => value is SafeInteger

/**
 * Casts an unknown value as safe-integer without any conversion; or null if unable.
 */
export const asSafeInteger = (value: unknown): SafeInteger | null =>
  Number.isSafeInteger(value)
    ? value as SafeInteger
    : null

/**
 * Parses a string as safe-integer; or null if unable.
 *
 * This function just forwards to [Number.parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt).
 */
export const parseSafeInteger = (str: string, radix?: number): SafeInteger | null =>
  asSafeInteger(Number.parseInt(str, radix))

/**
 * Tries to convert an unknown value to safe-integer, using some conversions if necessary: `Math.round`, `parseInt` or `.valueOf`.
 *
 * Mapping:
 *
 * - number:
 *    - safe-integer: the value
 *    - finite number: `Math.round` and `asSafeInteger` is used.
 *    - infinity, NaN: null
 * - string: `parseInt` and `asSafeInteger` is used.
 * - object:
 *    - non-null and has `valueOf`: `.valueOf()` and `asSafeInteger` is used.
 *    - other: null
 * - undefined, boolean, function and anything else: null
 */
// TODO: Support bigint in future
export const toSafeInteger = (value: unknown): SafeInteger | null => {
  switch (typeof value) {
    case "number":
      return numberToSafeInteger(value)

    case "string":
      return parseSafeInteger(value)

    case "object":
      return objectToSafeInteger(value)

    default:
      return null
  }
}

const numberToSafeInteger = (value: number): SafeInteger | null =>
  Number.isFinite(value)
    ? asSafeInteger(Math.round(value))
    : null

const objectToSafeInteger = (obj: object | null): SafeInteger | null => {
  if (typeof (obj as { valueOf?(): unknown } | null)?.valueOf !== "function") {
    return null
  }

  const value = (obj as { valueOf(): unknown }).valueOf()
  return typeof value === "number"
    ? numberToSafeInteger(value)
    : null
}
