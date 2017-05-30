import E from 'fantasy-eithers'
import curry from 'ramda/src/curry'
import allPass from 'ramda/src/allPass'
import prop from 'ramda/src/prop'
import propSatisfies from 'ramda/src/propSatisfies'
import all from 'ramda/src/all'
// import K from 'ramda/src/always'

/* istanbul ignore next */
function Ｘbinary(key, x, F) { return F[key](x) }
/* istanbul ignore next */
function Ｘternary(key, x, y, F) { return F[key](x, y) }
/* istanbul ignore next */
const arity = {
  /* istanbul ignore next */
  two: curry(Ｘbinary),
  /* istanbul ignore next */
  three: curry(Ｘternary)
}
export const ap = arity.two(`ap`)
export const bimap = arity.three(`bimap`)
export const fold = arity.three(`fold`)

const type = curry(
  function Ｘtype(t, x) { return typeof x === t } // eslint-disable-line valid-typeof
)
const isObject = type(`object`)
export const isFn = type(`function`)
// const propIsObject = propSatisfies(isObject)
const propIsFn = propSatisfies(isFn)

export const isEither = allPass([
  isObject,
  propIsFn(`fold`)
])
export const isRight = allPass([
  isEither,
  prop(`r`)
])
export const isLeft = allPass([
  isEither,
  prop(`l`)
])

export const guided = curry(function Ｘguided(direction, x) {
  return (
    isEither(x) ?
    x :
    direction(x)
  )
})
export const {
  Right,
  Left
} = E

export const GuidedRight = guided(Right)
export const GuidedLeft = guided(Left)

export const allFunctions = all(isFn)
