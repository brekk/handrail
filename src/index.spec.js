import { prop, map, is, pipe } from 'ramda'
import { hook } from 'ripjam/test'
import Either from 'easy-street'
import {
  handrail as safeHandrail,
  rail as safetyRail,
  guideRail as safeGuideRail
} from './debug'
import { handrail, rail, guideRail, multiRail } from './index'

const { riptest, same, shared } = hook()

describe('rail', () => {
  const notANumber = 'no number whatsoever'
  const standardCases = same([rail, safetyRail])
  standardCases(
    'the failure case works',
    [is(Number), () => notANumber, 'cool'],
    Either.Left(notANumber)
  )
  const aNumber = Math.round(Math.random() * 1e4)
  standardCases(
    'the success case works',
    [is(Number), () => notANumber, aNumber],
    Either.Right(aNumber)
  )
})

const unscrupulousBartender = user => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}

const usersShouldBe21 = ({ age = -1 }) => age > 20
const usersShouldHaveCashToCoverABeer = ({ cash }) => cash - 5 >= 0

const warnYoungsters = ({ name }) => `Expected ${name} to be 21!`
const warnWouldBeDebtors = ({ name }) =>
  `Expected ${name} to have at least 5 dollars!`

const makeUsers = () => {
  const willy = { name: 'guillermo', age: '86', cash: 100 }
  const greg = { name: 'greg', cash: 20, age: 60 }
  const anna = { age: 2, name: 'anna', cash: 0 }

  const jimmy = { name: 'jimmy', cash: 10, age: 10 }

  return { willy, greg, anna, jimmy }
}

const testGuide = (key, fn) => {
  describe(`real world example (${key})`, () => {
    const { willy } = makeUsers()
    const makeABartender = pipe(
      fn(
        [
          [usersShouldBe21, warnYoungsters],
          [usersShouldHaveCashToCoverABeer, warnWouldBeDebtors]
        ],
        unscrupulousBartender
      ),
      prop('value')
    )
    const quick = riptest(makeABartender)
    quick('guideRail - good test', willy, {
      ...willy,
      beverages: ['beer'],
      cash: 95
    })
  })
}
testGuide('guideRail', guideRail)
testGuide('safeGuideRail', safeGuideRail)
const testHand = (key, fn) =>
  describe(`real world example (${key})`, () => {
    const { willy, anna } = makeUsers()
    const ageAttentiveBartender = fn(
      usersShouldBe21,
      warnYoungsters,
      unscrupulousBartender
    )
    const quick = riptest(pipe(ageAttentiveBartender, prop('value')))
    quick('good path', willy, {
      ...willy,
      cash: 95,
      beverages: ['beer']
    })
    quick('bad path', anna, 'Expected anna to be 21!')
  })
testHand('handrail', handrail)
testHand('safeHandrail', safeHandrail)
describe('real world example (rail + multiRail)', () => {
  const { willy, jimmy, greg } = makeUsers()
  const cashAndAgeSafeBartender = pipe(
    rail(usersShouldBe21, warnYoungsters),
    multiRail(usersShouldHaveCashToCoverABeer, warnWouldBeDebtors),
    map(unscrupulousBartender),
    prop('value')
  )
  const quick = riptest(cashAndAgeSafeBartender)
  quick(
    'cashAndAgeSafeBartender - not of legal age',
    jimmy,
    'Expected jimmy to be 21!'
  )
  quick(
    'cashAndAgeSafeBartender - not enough monies',
    { name: 'alice', cash: 0, age: 30 },
    'Expected alice to have at least 5 dollars!'
  )
  quick('cashAndAgeSafeBartender - good path', greg, {
    ...greg,
    cash: 15,
    beverages: ['beer']
  })
  quick('cashAndAgeSafeBartender - good path again', greg, {
    ...greg,
    cash: 10,
    beverages: ['beer', 'beer']
  })
})
