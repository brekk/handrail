import test from 'ava'
import {prop, always as K, curry, pipe, add, identity} from 'ramda'
import {
  isRight,
  isLeft
} from './either/assert'
import {
  Right,
  Left,
  GuidedRight,
  rail,
  handrail,
  fold,
  guideRail
} from './index'

const grab = fold(identity, identity)
const messenger = pipe(grab, prop(`message`))

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
  const assertion = pipe(prop(k), (x) => !!x)
  const rationale = K(`this function won't ever do anything`)
  const inputObject = {
    [k]: v,
    xxx: `coolpants`
  }
  const good = rail(assertion, rationale, inputObject)
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
  const assertion = pipe(prop(`yyy`), (x) => !!x)
  const pseudo = random.alphaString(10)
  const errorString = `Random error: ${pseudo}`
  const rationale = K(errorString)
  const inputObject = {
    [k]: v,
    xxx: `coolpants`
  }
  const bad = rail(assertion, rationale, inputObject)
  t.deepEqual(bad, Left(errorString))
  return fold(
    (l) => {
      t.is(l, rationale())
    },
    t.fail,
    bad
  )
})
test.cb(`rail should Leftify a null input`, (t) => {
  t.plan(1)
  const bad = rail(K(true), K(`shit`), null)
  fold((x) => {
    t.is(x.message, `rail: Expected to be given non-null input.`)
    t.end()
  }, t.fail, bad)
})

test(`rail should fail with a Left when assertion is not a function`, (t) => {
  const badSafety = rail({}, identity, `whatever`)
  t.is(messenger(badSafety), `rail: Expected assertion to be function.`)
})
test(`rail should fail with a Left when wrongPath is not a function`, (t) => {
  const badDivider = rail(identity, {}, `whatever`)
  t.is(messenger(badDivider), `rail: Expected wrongPath to be function.`)
})
test(`rail should fail with a Left when assertion and wrongPath are not functions`, (t) => {
  const dumbInputs = rail({}, {}, `whatever`)
  t.is(messenger(dumbInputs), `rail: Expected assertion, wrongPath to be functions.`)
})

test(`handrail should allow for adding simple rails to a given function`, (t) => {
  t.plan(2)
  const input = random.keyValue(5)
  const [k, v] = input
  const assertion = pipe(prop(`yyy`), Boolean)
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
  const safeFunction = handrail(assertion, (x) => ({
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

test(`handrail should fail if assertion is not a function`, (t) => {
  const x = handrail({}, identity, identity, `whatever`)
  t.deepEqual(messenger(x), `handrail: Expected assertion to be function.`)
})
test(`handrail should fail if wrongPath is not a function`, (t) => {
  const y = handrail(identity, {}, identity, `whatever`)
  t.deepEqual(messenger(y), `handrail: Expected wrongPath to be function.`)
})
test(`handrail should fail if rightPath is not a function`, (t) => {
  const z = handrail(identity, identity, {}, `whatever`)
  t.deepEqual(messenger(z), `handrail: Expected rightPath to be function.`)
})
test(`handrail should fail with multiple assertions when there are multiple failures: 1`, (t) => {
  const a = handrail({}, {}, {}, `whatever`)
  t.deepEqual(messenger(a), `handrail: Expected assertion, wrongPath, rightPath to be functions.`)
})
test(`handrail should fail with multiple assertions when there are multiple failures: 2`, (t) => {
  const b = handrail(identity, {}, {}, `whatever`)
  t.deepEqual(messenger(b), `handrail: Expected wrongPath, rightPath to be functions.`)
})
test(`handrail should fail with multiple assertions when there are multiple failures: 3`, (t) => {
  const c = handrail({}, identity, {}, `whatever`)
  t.deepEqual(messenger(c), `handrail: Expected assertion, rightPath to be functions.`)
})
test(`handrail should fail with multiple assertions when there are multiple failures: 4`, (t) => {
  const d = handrail({}, {}, identity, `whatever`)
  t.deepEqual(messenger(d), `handrail: Expected assertion, wrongPath to be functions.`)
})

test(`guideRail should allow for multiple assertions at a single callsite`, (t) => {
  /*
  * @method guideRail
  * @param {functions[]} rails - an array of [assertion, failCase] pairs
  * @param {function} goodPath - what to do if things go well
  * @param {*} input - whatever
  * @returns {GuidedLeft|GuidedRight} - an Either
  */
  const rails = [
    [({age}) => age > 20, ({name}) => `Expected ${name} to be 21.`],
    [({cash}) => cash - 5 >= 0, ({name}) => `Expected ${name} to have cash.`],
    [({hair = `black`}) => hair === `black`, ({name}) => `Expected ${name} to have black hair.`]
  ]
  const goodPath = (user) => {
    /* eslint-disable fp/no-mutation */
    /* eslint-disable fp/no-mutating-methods */
    user.cash -= 5
    user.beverages = user.beverages || []
    user.beverages.push(`beer`)
    /* eslint-enable fp/no-mutation */
    /* eslint-enable fp/no-mutating-methods */
    return user
  }
  const alice = {
    name: `alice`,
    cash: 5,
    age: 25
  }
  const jimmy = {
    name: `jimmy`,
    cash: 10,
    age: 15
  }
  const redHead = {
    name: `redhead`,
    cash: 20,
    age: 40,
    hair: `red`
  }
  const guidedGrab = curry((r, p, i) => pipe(guideRail(r, p), grab)(i))
  const testCase = guidedGrab(rails, goodPath)
  const newAlice = testCase(alice)
  t.deepEqual(newAlice, {
    name: `alice`,
    cash: 0,
    beverages: [`beer`],
    age: 25
  })
  const newAlice2 = testCase(newAlice)
  t.is(newAlice2, `Expected alice to have cash.`)
  const newJimmy = testCase(jimmy)
  t.is(newJimmy, `Expected jimmy to be 21.`)
  t.is(testCase(redHead), `Expected redhead to have black hair.`)
})

/* eslint-enable fp/no-unused-expression */
