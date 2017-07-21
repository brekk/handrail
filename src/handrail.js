import {map, pipe, K, I, curry, curryObjectK} from 'f-utility'

import {rail} from './rail'
import {multiRail} from './multirail'
import {allPropsAreFunctions} from './assertions/all-props-are-functions'
import {rejectNonFunctions} from './assertions/reject-non-functions'
import {judgeObject} from './assertions/judge-object'
import {expectFunctionProps} from './errors/expect-function-props'

/**
 * @method safeWarn
 * @param {string} scope - scope input for potential warning
 * @param {*} input - anything
 * @returns {*} any
 * @private
 */
const safeWarn = curry((scope, input) => judgeObject({
  deliberation: I,
  jury: expectFunctionProps(scope),
  law: rejectNonFunctions,
  input
}))

/**
 * @method internalRailSafety
 * @param {string} scope - scope input for potential warning
 * @param {*} input - an object wwith `assertion`, `wrongPath`, and `rightPath` keys on it.
 * @returns {GuidedLeft|GuidedRight} an Either
 * @private
 */
const internalRailSafety = curryObjectK(
  [`assertion`, `wrongPath`, `rightPath`],
  (expectations) => rail(
    K(allPropsAreFunctions(expectations)),
    K(safeWarn(`handrail`, expectations))
  )
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
  function ＸＸＸhandrail(assertion, wrongPath, rightPath, input) {
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
