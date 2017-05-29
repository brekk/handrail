import test from 'ava'
import {prop, always as K, curry, pipe, add, identity} from 'ramda'
import {
  Right,
  Left,
  GuidedRight,
  isRight,
  isLeft,
  rail,
  handrail,
  fold
} from './index'

const random = (
  () => {
    const lower = (char) => char.toLowerCase()
    const randomSort = () => (0.5 - Math.random())
    const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(``)
    /* eslint-disable fp/no-mutating-methods */
    const string = curry(
      (input, length) => input.concat(
        input.map(lower)
      ).sort(
        randomSort
      ).slice(0, length).join(``)
    )
    /* eslint-enable fp/no-mutating-methods */
    const number = (x) => Math.random() * x
    const floor = pipe(number, Math.floor)
    const floorMin = curry((y, x) => pipe(floor, add(y))(x))
    const keyValue = (l) => ([string(alphabet, l), floorMin(1, l)])
    return {
      floor,
      floorMin,
      number,
      string,
      alphaString: string(alphabet),
      keyValue
    }
  }
)()
/* eslint-disable fp/no-unused-expression */

test(`GuidedRight should behave like Right given non-Either inputs`, (t) => {
  const input = random.alphaString(10)
  const r = Right(input)
  const r2 = GuidedRight(input)
  t.deepEqual(r, r2)
  t.truthy(isRight(r))
  t.truthy(isRight(r2))
  t.falsy(isLeft(r))
  t.falsy(isLeft(r2))
})

test(`GuidedRight should respect Left inputs`, (t) => {
  const input = random.alphaString(10)
  const inner = Left(input)
  const r = Right(inner)
  const r2 = GuidedRight(inner)
  t.truthy(isRight(r))
  t.truthy(isLeft(r2))
  t.falsy(isLeft(r))
  t.falsy(isRight(r2))
  t.notDeepEqual(r, r2)
  t.deepEqual(r.r.l, r2.l)
})

test(`GuidedRight should respect Right inputs`, (t) => {
  const input = random.alphaString(10)
  const inner = Right(input)
  const r = Right(inner)
  const r2 = GuidedRight(inner)
  t.truthy(isRight(r))
  t.truthy(isRight(r2))
  t.falsy(isLeft(r))
  t.falsy(isLeft(r2))
  t.notDeepEqual(r, r2)
  t.deepEqual(Object.keys(r), [`r`])
  t.is(typeof r.r, `object`)
  t.deepEqual(Object.keys(r2), [`r`])
  t.is(typeof r2.r, `string`)
  t.deepEqual(r.r.r, r2.r)
})

test(`rail / baluster should Rightify a good input`, (t) => {
  t.plan(3)
  const input = random.keyValue(5)
  const [k, v] = input
  const safety = pipe(prop(k), (x) => !!x)
  const rationale = K(`this function won't ever do anything`)
  const inputObject = {
    [k]: v,
    xxx: `coolpants`
  }
  const good = rail(safety, rationale, inputObject)
  t.deepEqual(good, Right(inputObject))
  return fold(
    t.fail,
    (r) => {
      t.is(r[k], v)
      return t.pass()
    },
    good
  )
})

test(`rail / baluster should Leftify a bad input`, (t) => {
  t.plan(2)
  const input = random.keyValue(5)
  const [k, v] = input
  const safety = pipe(prop(`yyy`), (x) => !!x)
  const pseudo = random.alphaString(10)
  const errorString = `Random error: ${pseudo}`
  const rationale = K(errorString)
  const inputObject = {
    [k]: v,
    xxx: `coolpants`
  }
  const bad = rail(safety, rationale, inputObject)
  t.deepEqual(bad, Left(errorString))
  return fold(
    (l) => {
      t.is(l, rationale())
    },
    t.fail,
    bad
  )
})

test(`rail should fail with a Left when safety or divider is not a function`, (t) => {
  const badSafety = rail({}, identity, `whatever`).fold(identity, identity)
  t.is(badSafety, `rail: Expected safety to be a function.`)
  const badDivider = rail(identity, {}, `whatever`).fold(identity, identity)
  t.is(badDivider, `rail: Expected divider to be a function.`)
})

test(`handrail should allow for adding simple rails to a given function`, (t) => {
  t.plan(2)
  const input = random.keyValue(5)
  const [k, v] = input
  const safety = pipe(prop(`yyy`), Boolean)
  const myFunction = (x) => {
    x.yyy += 1000 // eslint-disable-line fp/no-mutation
    return x
  }
  const input1 = {
    [k]: v,
    xxx: `coolpants`
  }
  const input2 = {
    xxx: `zipzops`,
    yyy: random.floorMin(1, 1e3)
  }
  const badObject = {
    ugh: `crapdammit ` + random.alphaString(4)
  }
  const safeFunction = handrail(safety, (x) => ({
    ...badObject,
    ...x
  }), myFunction)
  const bad = safeFunction(input1)
  const good = safeFunction(input2)
  t.deepEqual(bad, Left({
    ...badObject,
    ...input1
  }))
  t.deepEqual(good, Right(input2))
})

test(`handrail should fail if safety, badPath or goodPath is a function`, (t) => {
  const x = handrail({}, identity, identity, `whatever`).fold(identity, identity)
  t.deepEqual(x, `handrail: Expected safety to be a function.`)
  const y = handrail(identity, {}, identity, `whatever`).fold(identity, identity)
  t.deepEqual(y, `handrail: Expected badPath to be a function.`)
  const z = handrail(identity, identity, {}, `whatever`).fold(identity, identity)
  t.deepEqual(z, `handrail: Expected goodPath to be a function.`)
})

// test(`railing / balustrade should allow for adding structured rails for handrail programming`,
//   (t) => {
//
//   }
// )
/* eslint-enable fp/no-unused-expression */
