import Either from 'easy-street'
import {
  __ as $,
  any,
  apply,
  curry,
  concat,
  filter,
  identity as I,
  ifElse,
  includes,
  join,
  map,
  complement,
  pipe,
  toPairs,
  values
} from 'ramda'
import { isFunction, expectFunction } from './utils'
import { rail as __rail, multiRail as __multiRail } from './index'

const joint = ' and '

const expectedFunctions = pipe(
  toPairs,
  map(expectFunction),
  filter(I),
  join(joint),
  ifElse(
    includes(joint),
    ex => `Expected ${ex} to be functions.`,
    ex => `Expected ${ex} to be a function.`
  ),
  Either.Left
)

const anyValuesAreNotFunctions = pipe(
  values,
  any(complement(isFunction))
)
const callFunctionSafely = curry((fn, input, args) =>
  pipe(values, concat($, [input]), apply(fn))(args)
)

const delegatedCall = curry(function _delegatedCall(fn, args, input) {
  return ifElse(
    anyValuesAreNotFunctions,
    expectedFunctions,
    callFunctionSafely(fn, input)
  )(args)
})

export const rail = curry(function _safetyRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(__rail, { condition, badPath }, input)
})

export const handrail = curry(function _safetyHandRail(
  condition,
  badPath,
  goodPath,
  input
) {
  return pipe(rail(condition, badPath), map(goodPath))(input)
})

export const multiRail = curry(function _safetyMultiRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(__multiRail, { condition, badPath }, input)
})

export const guideRail = curry(function _safetyGuideRail(
  rails,
  goodPath,
  input
) {
  const multiMap = apply(multiRail)
  const [first, ...rest] = rails
  const [firstAssertion, wrongPath] = first
  return pipe(
    ...[
      rail(firstAssertion, wrongPath),
      ...map(multiMap, rest),
      map(goodPath)
    ]
  )(input)
})
