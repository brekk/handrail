/* global test */
import {map} from 'f-utility'
import {e0} from 'entrust'
import {t} from 'germs'
import {
  judgement,
  allPropsAreFunctions
} from '@assertions'

/* eslint-disable fp/no-unused-expression */

/*
export const judgement = curryObjectK(
  [`jury`, `law`, `input`],
  ({
    jury,
    law,
    input,
    deliberation = I,
    pre = I,
    post = I
  }) => pipe(
    law,
    pipe(pre, deliberation, post),
    jury
  )(input)
)
 */

test(`judgement is just a structured pipe`, (done) => {
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
    jury: () => done(),
    input
  }
  return judgement(inputO)
})

const upper = e0(`toUpperCase`)
const lower = e0(`toLowerCase`)

const testFn = (fn) => (done) => {
  t.plan(4)
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

test(`allPropsAreFunctions should return true for a given object who only has method props`, () => {
  t.falsy(allPropsAreFunctions({}))
  t.truthy(allPropsAreFunctions({a: () => {}}))
  t.truthy(allPropsAreFunctions({a: () => {}, b: () => {}}))
  t.falsy(allPropsAreFunctions({a: () => {}, b: () => {}, c: false}))
})

/* eslint-enable fp/no-unused-expression */
