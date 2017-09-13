/* global test */
import {map} from 'f-utility'
import {e0} from 'entrust'
import {
  judgement,
  judgeObject
} from './assertions/judge-object'
import {t} from './test-helpers'

/* eslint-disable fp/no-unused-expression */
test(`judgement is just a structured pipe`, (done) => {
  t.plan(4)
  t.is(typeof judgement, `function`)
  const input = `some input`
  const inputO = {
    law: (x) => {
      // console.log(`xxxx`, x)
      t.is(x, input)
      return x
    },
    deliberation: (x) => {
      // console.log(`yyyy`, x)
      t.is(x, input)
      return x
    },
    jury: (x) => {
      // console.log(`zzzz`, x)
      t.is(x, input)
      done()
    },
    input
  }
  return judgement(inputO)
})

const upper = e0(`toUpperCase`)
const lower = e0(`toLowerCase`)

const postForJudgment = ({k}) => ({k: lower(k)})
const postForOther = map(lower)

const testFn = (fn) => (done) => {
  t.plan(fn === judgeObject ? 3 : 4)
  t.is(typeof fn, `function`)
  const input = {k: `Some input with MIXED capitalization`}
  const post = (
    (fn === judgement) ? postForJudgment : postForOther
  )
  const inputO = {
    law: (x) => {
      t.deepEqual(x, input)
      return x
    },
    pre: ({k}) => ({k: upper(k)}),
    deliberation: ({k}) => {
      t.is(k, k.toUpperCase())
      return {k}
    },
    post,
    jury: (end) => {
      if (fn === judgement) {
        const {k} = end
        t.is(k, k.toLowerCase())
      } else {
        t.deepEqual(end, [`k`])
      }
      done()
    },
    input
  }
  return fn(inputO)
}

test(
  `judgement is just a structured pipe (and pre and post are useful)`,
  testFn(judgement)
)

test(
  `judgeObject is just a structured pipe (and pre and post are useful)`,
  testFn(judgeObject)
)

test(
  `judgement's deliberation is identity by default`,
  (done) => {
    t.plan(3)
    t.is(typeof judgement, `function`)
    const input = {k: `some input with mixed capitalization`}
    const inputO = {
      law: (x) => {
        t.deepEqual(x, input)
        return x
      },
      jury: (end) => {
        const {k} = end
        t.is(k, k.toLowerCase())
        done()
      },
      input
    }
    return judgement(inputO)
  }
)

/* eslint-enable fp/no-unused-expression */
