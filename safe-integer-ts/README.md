# SafeInteger for TypeScript

Provides `SafeInteger` type, a newtype wrapper of `number` as [safe-integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) or 53-bit precise integer.

See the implementations (src/index.ts) for more details.

## Install

```sh
npm install safe-integer-ts
```

## Example

```ts
import { SafeInteger, asSafeInteger, isSafeInteger, toSafeInteger } from "safe-integer-ts"

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
```

## Type-safety

```ts
import { SafeInteger, isSafeInteger } from "safe-integer-ts"

const useNumber = (_value: number) => {}
const useSafeInteger = (_value: SafeInteger) => {}

const value = NaN
if (isSafeInteger(value)) {
    // OK: SafeInteger -> SafeInteger
    useSafeInteger(value)

    // OK: SafeInteger -> number
    useNumber(value)
}

useSafeInteger(value)
//             ^^^^^ NG: number is not SafeInteger
```
