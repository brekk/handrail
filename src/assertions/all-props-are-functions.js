import {keys, ap, isFunction, pipe, filter, length} from 'f-utility'
const keyLength = pipe(keys, length)
export const allPropsAreFunctions = pipe(
  (x) => ([x]), // ap needs box!
  ap([
    pipe(
      filter(isFunction),
      keyLength,
      Number // needs to be coerced
    ),
    keyLength
  ]),
  ([result, expected]) => (result === expected)
)
