import Either from 'easy-street';
import { curry, ifElse, pipe, chain, map, apply, either, propEq, is, always } from 'ramda';
export { chain, map } from 'ramda';

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

const isEither = either(
  propEq('isLeft', true),
  propEq('isRight', true)
);

const isFunction = is(Function);

curry(function _expectFunction([
  name,
  f
]) {
  return ifElse(isFunction, always(false), always(name))(f)
});

const bimap = curry(function _bimap(f, g, x) {
  return x.bimap(f, g)
});
const fold = curry(function _fold(f, g, x) {
  return x.fold(f, g)
});

export { bimap, fold, guideRail, handrail, isEither, multiRail, rail };
