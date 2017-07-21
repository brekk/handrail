import test from 'ava'
import {map} from 'f-utility'
import {e0} from 'entrust'
import {
  judgement,
  judgeObject
} from './assertions/judge-object'

/* eslint-disable fp/no-unused-expression */
test.cb(`judgement is just a structured pipe`, (t) => {
  t.plan(3)
  t.is(typeof judgement, `function`)
  const input = `some input`
  const inputO = {
    law: (x) => {
      t.is(x, input)
      return x
    },
    deliberation: (x) => {
      t.is(x, input)
      return x
    },
    jury: () => t.end(),
    input
  }
  return judgement(inputO)
})

const upper = e0(`toUpperCase`)
const lower = e0(`toLowerCase`)

const testFn = (fn) => (t) => {
  t.plan(fn === judgeObject ? 3 : 4)
  t.is(typeof fn, `function`)
  const input = {k: `Some input with MIXED capitalization`}
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
    post: (
      fn === judgement ?
      ({k}) => ({k: lower(k)}) :
      (list) => map(lower, list)
    ),
    jury: (end) => {
      if (fn === judgement) {
        const {k} = end
        t.is(k, k.toLowerCase())
      } else {
        t.deepEqual(end, [`k`])
      }
      t.end()
    },
    input
  }
  return fn(inputO)
}

test.cb(
  `judgement is just a structured pipe (and pre and post are useful)`,
  testFn(judgement)
)

test.cb(
  `judgeObject is just a structured pipe (and pre and post are useful)`,
  testFn(judgeObject)
)
/* eslint-enable fp/no-unused-expression */
