import {isFunction, isObject} from 'f-utility'

export const isEither = (x) => (
  x &&
  isObject(x) &&
  x.fold &&
  isFunction(x.fold)
)
