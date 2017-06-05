import E from 'fantasy-eithers'
import curry from 'ramda/src/curry'
// import K from 'ramda/src/always'
import {isEither} from './assertions'

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

export const plural = (x) => x.length > 1 ? `s` : ``
