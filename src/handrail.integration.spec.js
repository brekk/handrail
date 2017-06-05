import test from 'ava'
// import K from 'ramda/src/always'
// import identity from 'ramda/src/identity'
import * as Ｘ from './index'

const {
  Left,
  Right
} = Ｘ

const YAHH = `examples -`

/* eslint-disable fp/no-unused-expression */

test(`${YAHH} JSON.parse`, (t) => {
  t.plan(5)
  t.is(typeof Ｘ, `object`)
  t.is(typeof Ｘ.handrail, `function`)
  t.throws(
    () => {
      JSON.parse(``)
    },
    `Unexpected end of JSON input`
  )
  const errorFunction = (x) => (
    `Expected to be given string that looks like {}, maybe with some props. But got: ${x}`
  )
  const safeParse = Ｘ.handrail(
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
  t.deepEqual(safeParse(`{}`), Right({}))
})

/* eslint-enable fp/no-unused-expression */
