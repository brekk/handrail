/* global test */
import {I, map, pipe, reject, isFunction} from 'f-utility'
import {t} from 'germs'
// import {trace} from 'xtrace'
// import K from 'ramda/src/always'
// import identity from 'ramda/src/identity'
import * as X from './index'

const {
  Left
} = X

const zort = (x) => x.sort() // eslint-disable-line fp/no-mutating-methods

const HR = `handrail -`

/* eslint-disable fp/no-unused-expression */
test(`${HR} published module should have access to all keys`, () => {
  t.deepEqual(
    zort(
      Object.keys(X)
    ),
    zort(
      [
        `GuidedLeft`,
        `GuidedRight`,
        `Left`,
        `Right`,
        `ap`,
        `isEither`,
        `baluster`,
        `balustrade`,
        `bimap`,
        `chain`,
        `fold`,
        `guideRail`,
        `guided`,
        `handrail`,
        `map`,
        `multiRail`,
        `net`,
        `rail`
      ]
    )
  )
  t.deepEqual(
    reject(isFunction, X),
    {}
  )
})

test(`${HR} JSON.parse`, () => {
  // t.plan(5)
  t.is(typeof X, `object`)
  t.is(typeof X.handrail, `function`)
  t.throws(
    () => {
      JSON.parse(``)
    },
    `Unexpected end of JSON input`
  )
  const errorFunction = (x) => (
    `Expected to be given string that looks like {}, maybe with some props. But got: ${x}`
  )
  const safeParse = X.handrail(
    (input) => (
      typeof input === `string` &&
      input.length > 1 &&
      input[0] === `{` &&
      input[input.length - 1] === `}`
    ),
    errorFunction,
    JSON.parse
  )
  t.deepEqual(safeParse(``), Left(errorFunction(``)))
  // t.deepEqual(safeParse(`{}`), Right({}))
})

test(`${HR} literate example`, () => {
  const unscrupulousBartender = (user) => {
    /* eslint-disable fp/no-mutation */
    /* eslint-disable fp/no-mutating-methods */
    user.cash -= 5
    user.beverages = user.beverages || []
    user.beverages.push(`beer`)
    /* eslint-enable fp/no-mutation */
    /* eslint-enable fp/no-mutating-methods */
    return user
  }
  const logOrWarn = X.fold(I, I)

  // let's establish our basic expectations
  const usersShouldBe21 = ({age}) => age > 20
  const usersShouldHaveCashToCoverABeer = ({cash}) => cash - 5 >= 0

  // and the errors we have
  const warnYoungsters = (user) => `Expected ${user.name} to be 21!`
  const warnWouldBeDebtors = (user) => `Expected ${user.name} to have at least 5 dollars!`

  const cashAndAgeSafeBartender = pipe(
    // add safety for age!
    X.rail(usersShouldBe21, warnYoungsters),
    // trace(`users should be 21`),
    // add safety for cash!
    // multiRail is identical to rail, but should only be used when rail is already being used
    X.multiRail(usersShouldHaveCashToCoverABeer, warnWouldBeDebtors),
    // trace(`users should have cash`),
    // alter the Either value, so wrap our original function in `map`
    map(unscrupulousBartender),
    // trace(`no scruples, bro`),
    // convert our Either value to a string and print it
    logOrWarn
    // trace(`output`)
  )
  const resetUsers = () => ({
    alice: {name: `alice`, cash: 15, age: 22},
    jimmy: {name: `jimmy`, cash: 20, age: 20}
  })

  let {alice, jimmy} = resetUsers() // eslint-disable-line fp/no-let
  t.is(cashAndAgeSafeBartender(jimmy), `Expected jimmy to be 21!`)
  const alice1 = cashAndAgeSafeBartender(alice)
  t.deepEqual(alice1, {
    age: 22,
    beverages: [`beer`],
    cash: 10,
    name: `alice`
  })
  const alice2 = cashAndAgeSafeBartender(alice1)
  t.deepEqual(alice2, {
    age: 22,
    beverages: [`beer`, `beer`],
    cash: 5,
    name: `alice`
  })
  const alice3 = cashAndAgeSafeBartender(alice2)
  t.deepEqual(alice3, {
    age: 22,
    beverages: [`beer`, `beer`, `beer`],
    cash: 0,
    name: `alice`
  })
  const alice4 = cashAndAgeSafeBartender(alice3)
  t.is(alice4, `Expected alice to have at least 5 dollars!`)
  const guideRailExample = pipe(
    X.guideRail(
      [
        // add safety for age!
        [usersShouldBe21, warnYoungsters],
        // add safety for cash!
        [usersShouldHaveCashToCoverABeer, warnWouldBeDebtors]
        // add more!
      ],
      // alter the Either value
      unscrupulousBartender
    ),
    logOrWarn
  )
  t.is(guideRailExample(alice3), `Expected alice to have at least 5 dollars!`)
  t.is(guideRailExample(jimmy), `Expected jimmy to be 21!`)
})

/* eslint-enable fp/no-unused-expression */
