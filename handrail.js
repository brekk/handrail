'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Either = require('easy-street');
var ramda = require('ramda');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Either__default = /*#__PURE__*/_interopDefaultLegacy(Either);

const rail = ramda.curry(function _rail(condition, badPath, input) {
  return ramda.ifElse(
    condition,
    Either__default['default'].Right,
    ramda.pipe(badPath, Either__default['default'].Left)
  )(input)
});

const multiRail = ramda.curry(function _multiRail(
  condition,
  badPath,
  input
) {
  return ramda.chain(rail(condition, badPath), input)
});

const handrail = ramda.curry(function _handrail(
  condition,
  badPath,
  goodPath,
  input
) {
  return ramda.pipe(rail(condition, badPath), ramda.map(goodPath))(input)
});

const guideRail = ramda.curry(function guideRail(
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

const isFunction = ramda.is(Function);

ramda.curry(function _expectFunction([
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

exports.bimap = bimap;
exports.fold = fold;
exports.guideRail = guideRail;
exports.handrail = handrail;
exports.multiRail = multiRail;
exports.rail = rail;
