import {chain, curry} from 'f-utility'
import {rail} from '@handrail/rail'

/**
 * `multiRail` is nearly-identical to `rail`, but should only be used if `rail` is already in use
 * This is a useful function if you need very granular control of your pipe. If not, you should
 * probably use `guideRail` instead.
 * @method multiRail
 * @param {function} assertion - boolean-returning function
 * @param {function} wrongPath - function invoked if the inputs are bad
 * @param {*} input - any input
 * @returns {GuidedRight|GuidedLeft} Left / Right -wrapped value
 * @public
 * @example
 * import {rail, multiRail} from 'handrail'
 * import pipe from 'ramda/src/pipe'
 * const divide = (a, b) => a / b
 * const safeDivide = curry((a, b) => pipe(
 *   rail(() => (typeof a === `number`), () => `Expected ${a} to be a number!`),
 *   multiRail(() => (typeof b === `number`), () => `Expected ${b} to be a number!`)
 *   multiRail(() => b !== 0, () => `Expected ${b} to not be zero!`),
 *   divide(a)
 * )(b)
 */
export const multiRail = curry(
  function _multiRail(assertion, wrongPath, input) {
    return chain(
      rail(assertion, wrongPath),
      input
    )
  }
)
