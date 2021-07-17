import { curry, ifElse, is, always as K } from 'ramda'

export const isFunction = is(Function)

export const expectFunction = curry(function _expectFunction([
  name,
  f
]) {
  return ifElse(isFunction, K(false), K(name))(f)
})

export const bimap = curry(function _bimap(f, g, x) {
  return x.bimap(f, g)
})
export const fold = curry(function _fold(f, g, x) {
  return x.fold(f, g)
})
