import {map, pipe, K, keys, curry, curryObjectN} from 'f-utility'
import {rail} from '@handrail/rail'
import {multiRail} from '@handrail/multirail'
import {allPropsAreFunctions} from '@assertions/all-props-are-functions'
import {rejectNonFunctions} from '@assertions/reject-non-functions'
import {expectFunctionProps} from '@errors/expect-function-props'

/**
 * @method safeWarn
 * @param {string} scope - scope input for potential warning
 * @param {*} input - anything
 * @returns {*} any
 * @private
 */
export const safeWarn = curry(
  function λsafeWarn(scope, input) {
    return pipe(
      rejectNonFunctions,
      keys,
      expectFunctionProps(scope)
    )(input)
  }
)

/**
 * @method internalRailSafety
 * @param {string} scope - scope input for potential warning
 * @param {*} input - an object wwith `assertion`, `wrongPath`, and `rightPath` keys on it.
 * @returns {GuidedLeft|GuidedRight} an Either
 * @private
 */
const internalRailSafety = curryObjectN(
  3,
  function λinternalRailSafety(expectations) {
    return rail(
      K(allPropsAreFunctions(expectations)),
      K(safeWarn(`handrail`, expectations))
    )
  }
)
/**
 * @method handrail
 * @param {function} assertion - a function to test the input with
 * @param {function} wrongPath - a function to prepare data before it passes into the Left path
 * @param {function} rightPath - a function to modify after it passes into the Right path
 * @param {*} input - any input
 * @returns {GuidedLeft|GuidedRight} an Either
 * @public
 */
export const handrail = curry(
  function λhandrail(assertion, wrongPath, rightPath, input) {
    return pipe(
      // first prove we have good inputs
      internalRailSafety({assertion, wrongPath, rightPath}),
      // then use the functions to create a rail
      multiRail(assertion, wrongPath),
      // then modify your data if we're on the Right path
      map(rightPath)
    )(input)
  }
)
