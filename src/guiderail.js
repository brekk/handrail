import {map, pipe, curry} from 'f-utility'
import {rail} from '@handrail/rail'
import {multiRail} from '@handrail/multirail'

/**
 * Encapsulate error states in a simple structure that returns a Left on error or Right on success
 * @method guideRail
 * @param {functions[]} rails - an array of [assertion, failCase] pairs
 * @param {function} goodPath - what to do if things go well
 * @param {*} input - whatever
 * @returns {GuidedLeft|GuidedRight} - an Either
 * @example
 * import pipe from 'ramda/src/pipe'
 * import {guideRail, fold} from 'handrail'
 * const identity = (x) => x
 * const rails = [
 *   [({age}) => age > 20, ({name}) => `Expected ${name} to be 21.`],
 *   [({cash}) => cash - 5 >= 0, ({name}) => `Expected ${name} to have cash.`],
 * ]
 * const bartender = (user) => {
 *   user.cash -= 5
 *   user.beverages = user.beverages || []
 *   user.beverages.push(`beer`)
 *   return user
 * }
 * const cashAndAgeSafeBartender = pipe(
 *   guideRail(rails, bartender),
 *   fold(identity, identity)
 * )
 */
export const guideRail = curry(
  (rails, goodPath, input) => {
    const multiMap = ([a, w]) => multiRail(a, w)
    const [first, ...rest] = rails // eslint-disable-line fp/no-rest-parameters
    const [firstAssertion, wrongPath] = first
    return pipe(
      ...[
        rail(firstAssertion, wrongPath),
        ...map(multiMap, rest),
        map(goodPath)
      ]
    )(input)
  }
)
