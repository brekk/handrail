import {e1, e2} from 'entrust'
import E from 'fantasy-eithers'
import {curry} from 'katsu-curry'
import {isEither} from './assertions'

export const ap = e1(`ap`)

/**
 * @method bimap
 * @param {function} leftPath - do something if function receives a Left
 * @param {function} rightPath - do something if function receives a Right
 * @param {Either} either - either a Left or a Right
 * @returns {Either} the original Either, mapped over, but like, with handed-ness
 * @public
 */
export const bimap = e2(`bimap`)

/**
 * @method fold
 * @param {function} leftPath - do something if function receives a Left
 * @param {function} rightPath - do something if function receives a Right
 * @param {Either} either - either a Left or a Right
 * @returns {*} the value from within an Either, pulled out of the monadic box
 * @public
 */
export const fold = e2(`fold`)

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
