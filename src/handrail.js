import {pipe, K, I, curry, curryObjectK} from 'katsu-curry'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'

import {
  judgeObject,
  // allFunctions,
  allPropsAreFunctions,
  rejectNonFunctions
} from './assertions'

import {
  plural,
  GuidedLeft,
  GuidedRight
} from './util'

// NB: relative to how daggy defines its toString methods and how the error stack looks,
// we're using the convention of prefixing ＸＸＸ to the main functions so that they aren't
// anonymous and scan reasonably well

/**
 * @method expectFn
 * @param {string} scope - string that gives scope to the error
 * @param {string[]} errors - a list of error(s)
 * @returns {Error} an error
 * @private
 */
const expectFn = curry((scope, errors) => (
  new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
))

/**
 * @method safeRailInputs
 * @param {object} inputs - an object of inputs
 * @return {string[]} array of strings
 * @private
 */
const safeRailInputs = pipe(
  rejectNonFunctions,
  Object.keys
)

/**
 * Add safety to your pipelines!
 * @method rail
 * @param {function} assertion - boolean-returning function
 * @param {function} wrongPath - function invoked if the inputs are bad
 * @param {*} input - any input
 * @returns {GuidedRight|GuidedLeft} Left / Right -wrapped value
 * @public
 */
export const rail = curry(
  function ＸＸＸrail(assertion, wrongPath, input) {
    if (input == null) {
      return GuidedLeft(new Error(`rail: Expected to be given non-null input.`))
    }
    const issues = safeRailInputs({assertion, wrongPath})
    if (issues.length > 0) {
      return GuidedLeft(expectFn(`rail`, issues))
    }
    return (
      assertion(input) ?
      GuidedRight :
      pipe(wrongPath, GuidedLeft)
    )(input)
  }
)

/**
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

/**
 * @method safeWarn
 * @param {string} scope - scope input for potential warning
 * @param {*} input - a
 * @returns {*} any
 * @private
 */
const safeWarn = curry((scope, input) => judgeObject({
  deliberation: I,
  jury: expectFn(scope),
  law: rejectNonFunctions,
  input
}))

/**
 * @method internalRailSafety
 * @param {string} scope - scope input for potential warning
 * @param {*} input - a
 * @returns {*} any
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
 * @returns {*} whatever your rightPath does
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
