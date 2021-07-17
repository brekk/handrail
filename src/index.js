import Either from 'easy-street'
import { apply, chain, map, curry, ifElse, pipe } from 'ramda'

export const rail = curry(function _rail(condition, badPath, input) {
  return ifElse(
    condition,
    Either.Right,
    pipe(badPath, Either.Left)
  )(input)
})

export const multiRail = curry(function _multiRail(
  condition,
  badPath,
  input
) {
  return chain(rail(condition, badPath), input)
})

export const handrail = curry(function _handrail(
  condition,
  badPath,
  goodPath,
  input
) {
  return pipe(rail(condition, badPath), map(goodPath))(input)
})

export const guideRail = curry(function guideRail(
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
