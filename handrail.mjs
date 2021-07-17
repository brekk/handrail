import Either from 'easy-street';
import { curry, ifElse, pipe, chain, map, apply } from 'ramda';

const rail = curry(function _rail(condition, badPath, input) {
  return ifElse(
    condition,
    Either.Right,
    pipe(badPath, Either.Left)
  )(input)
});

const multiRail = curry(function _multiRail(
  condition,
  badPath,
  input
) {
  return chain(rail(condition, badPath), input)
});

const handrail = curry(function _handrail(
  condition,
  badPath,
  goodPath,
  input
) {
  return pipe(rail(condition, badPath), map(goodPath))(input)
});

const guideRail = curry(function guideRail(
  rails,
  goodPath,
  input
) {
  const multiMap = apply(multiRail);
  const [first, ...rest] = rails;
  const [firstAssertion, wrongPath] = first;
  return pipe(
    ...[
      rail(firstAssertion, wrongPath),
      ...map(multiMap, rest),
      map(goodPath)
    ]
  )(input)
});

export { guideRail, handrail, multiRail, rail };
