import chain from 'ramda/src/chain'
import {curry} from 'f-utility'
import {rail} from './rail'

/**
 * `multiRail` is nearly-identical to `rail`, but should only be used if `rail` is already in use
 * @method multiRail
 * @param {function} assertion - boolean-returning function
 * @param {function} wrongPath - function invoked if the inputs are bad
 * @param {*} input - any input
 * @returns {GuidedRight|GuidedLeft} Left / Right -wrapped value
 * @public
 */
export const multiRail = curry(
  function ＸＸＸmultiRail(assertion, wrongPath, input) {
    return chain(
      rail(assertion, wrongPath),
      input
    )
  }
)
