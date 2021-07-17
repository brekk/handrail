import Either from 'easy-street';
import { either, propEq, is, curry, ifElse, always, pipe, chain, map, apply, toPairs, filter, identity, join, includes, values, any, complement, concat, __ } from 'ramda';
export { chain, map } from 'ramda';

const isEither = either(
  propEq('isLeft', true),
  propEq('isRight', true)
);

const isFunction = is(Function);

const expectFunction = curry(function _expectFunction([
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

const rail$1 = curry(function _rail(condition, badPath, input) {
  return ifElse(
    condition,
    Either.Right,
    pipe(badPath, Either.Left)
  )(input)
});

const multiRail$1 = curry(function _multiRail(
  condition,
  badPath,
  input
) {
  return chain(rail$1(condition, badPath), input)
});

curry(function _handrail(
  condition,
  badPath,
  goodPath,
  input
) {
  return pipe(rail$1(condition, badPath), map(goodPath))(input)
});

curry(function guideRail(
  rails,
  goodPath,
  input
) {
  const multiMap = apply(multiRail$1);
  const [first, ...rest] = rails;
  const [firstAssertion, wrongPath] = first;
  return pipe(
    ...[
      rail$1(firstAssertion, wrongPath),
      ...map(multiMap, rest),
      map(goodPath)
    ]
  )(input)
});

const joint = ' and ';

const expectedFunctions = pipe(
  toPairs,
  map(expectFunction),
  filter(identity),
  join(joint),
  ifElse(
    includes(joint),
    ex => `Expected ${ex} to be functions.`,
    ex => `Expected ${ex} to be a function.`
  ),
  Either.Left
);

const anyValuesAreNotFunctions = pipe(
  values,
  any(complement(isFunction))
);
const callFunctionSafely = curry((fn, input, args) =>
  pipe(values, concat(__, [input]), apply(fn))(args)
);

const delegatedCall = curry(function _delegatedCall(fn, args, input) {
  return ifElse(
    anyValuesAreNotFunctions,
    expectedFunctions,
    callFunctionSafely(fn, input)
  )(args)
});

const rail = curry(function _safetyRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(rail$1, { condition, badPath }, input)
});

const handrail = curry(function _safetyHandRail(
  condition,
  badPath,
  goodPath,
  input
) {
  return pipe(rail(condition, badPath), map(goodPath))(input)
});

const multiRail = curry(function _safetyMultiRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(multiRail$1, { condition, badPath }, input)
});

const guideRail = curry(function _safetyGuideRail(
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

export { bimap, fold, guideRail, handrail, isEither, multiRail, rail };
