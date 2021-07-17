'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Either = require('easy-street');
var ramda = require('ramda');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Either__default = /*#__PURE__*/_interopDefaultLegacy(Either);

const isEither = ramda.either(
  ramda.propEq('isLeft', true),
  ramda.propEq('isRight', true)
);

const isFunction = ramda.is(Function);

const expectFunction = ramda.curry(function _expectFunction([
  name,
  f
]) {
  return ramda.ifElse(isFunction, ramda.always(false), ramda.always(name))(f)
});

const bimap = ramda.curry(function _bimap(f, g, x) {
  return x.bimap(f, g)
});
const fold = ramda.curry(function _fold(f, g, x) {
  return x.fold(f, g)
});

const rail$1 = ramda.curry(function _rail(condition, badPath, input) {
  return ramda.ifElse(
    condition,
    Either__default['default'].Right,
    ramda.pipe(badPath, Either__default['default'].Left)
  )(input)
});

const multiRail$1 = ramda.curry(function _multiRail(
  condition,
  badPath,
  input
) {
  return ramda.chain(rail$1(condition, badPath), input)
});

ramda.curry(function _handrail(
  condition,
  badPath,
  goodPath,
  input
) {
  return ramda.pipe(rail$1(condition, badPath), ramda.map(goodPath))(input)
});

ramda.curry(function guideRail(
  rails,
  goodPath,
  input
) {
  const multiMap = ramda.apply(multiRail$1);
  const [first, ...rest] = rails;
  const [firstAssertion, wrongPath] = first;
  return ramda.pipe(
    ...[
      rail$1(firstAssertion, wrongPath),
      ...ramda.map(multiMap, rest),
      ramda.map(goodPath)
    ]
  )(input)
});

const joint = ' and ';

const expectedFunctions = ramda.pipe(
  ramda.toPairs,
  ramda.map(expectFunction),
  ramda.filter(ramda.identity),
  ramda.join(joint),
  ramda.ifElse(
    ramda.includes(joint),
    ex => `Expected ${ex} to be functions.`,
    ex => `Expected ${ex} to be a function.`
  ),
  Either__default['default'].Left
);

const anyValuesAreNotFunctions = ramda.pipe(
  ramda.values,
  ramda.any(ramda.complement(isFunction))
);
const callFunctionSafely = ramda.curry((fn, input, args) =>
  ramda.pipe(ramda.values, ramda.concat(ramda.__, [input]), ramda.apply(fn))(args)
);

const delegatedCall = ramda.curry(function _delegatedCall(fn, args, input) {
  return ramda.ifElse(
    anyValuesAreNotFunctions,
    expectedFunctions,
    callFunctionSafely(fn, input)
  )(args)
});

const rail = ramda.curry(function _safetyRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(rail$1, { condition, badPath }, input)
});

const handrail = ramda.curry(function _safetyHandRail(
  condition,
  badPath,
  goodPath,
  input
) {
  return ramda.pipe(rail(condition, badPath), ramda.map(goodPath))(input)
});

const multiRail = ramda.curry(function _safetyMultiRail(
  condition,
  badPath,
  input
) {
  return delegatedCall(multiRail$1, { condition, badPath }, input)
});

const guideRail = ramda.curry(function _safetyGuideRail(
  rails,
  goodPath,
  input
) {
  const multiMap = ramda.apply(multiRail);
  const [first, ...rest] = rails;
  const [firstAssertion, wrongPath] = first;
  return ramda.pipe(
    ...[
      rail(firstAssertion, wrongPath),
      ...ramda.map(multiMap, rest),
      ramda.map(goodPath)
    ]
  )(input)
});

Object.defineProperty(exports, 'chain', {
  enumerable: true,
  get: function () {
    return ramda.chain;
  }
});
Object.defineProperty(exports, 'map', {
  enumerable: true,
  get: function () {
    return ramda.map;
  }
});
exports.bimap = bimap;
exports.fold = fold;
exports.guideRail = guideRail;
exports.handrail = handrail;
exports.isEither = isEither;
exports.multiRail = multiRail;
exports.rail = rail;
