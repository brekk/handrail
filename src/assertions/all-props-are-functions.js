import {isFunction, pipe, reject, length} from 'f-utility'
export const allPropsAreFunctions = pipe(
  reject(isFunction),
  Object.keys,
  length,
  (x) => x === 0
)
