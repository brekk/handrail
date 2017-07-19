import {isFunction, pipe, reject} from 'f-utility'
import {length} from 'katsu-curry/lib/utils/length'

export const allPropsAreFunctions = pipe(
  reject(isFunction),
  Object.keys,
  length,
  (x) => x === 0
)
