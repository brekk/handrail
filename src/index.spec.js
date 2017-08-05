import test from 'ava'
// import {random} from 'f-utility'
import {pipe, keys} from 'f-utility'
import * as HANDRAIL from './index'

const sortedKeys = pipe(keys, (x) => x.sort()) // eslint-disable-line fp/no-mutating-methods

/* eslint-disable fp/no-unused-expression */
test(`index`, (t) => {
  t.deepEqual(sortedKeys(HANDRAIL), [
    `GuidedLeft`,
    `GuidedRight`,
    `Left`,
    `Right`,
    `ap`,
    `baluster`,
    `balustrade`,
    `bimap`,
    `chain`,
    `fold`,
    `guideRail`,
    `guided`,
    `handrail`,
    `isEither`,
    `map`,
    `multiRail`,
    `net`,
    `rail`
  ])
})
/* eslint-enable fp/no-unused-expression */
