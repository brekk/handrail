import Either from 'easy-street'
import {
  curry,
  ifElse,
  is,
  join,
  map,
  pipe,
  reject,
  toPairs,
  when,
  always as K
} from 'ramda'

export const isFunction = is(Function)

export const expectFunction = curry(function _expectFunction([
  name,
  f
]) {
  return ifElse(isFunction, K(false), K(name))(f)
})
