/* global test */
import {t} from 'germs'
import {
  allPropsAreFunctions
} from '@assertions'

/* eslint-disable fp/no-unused-expression */

test(`allPropsAreFunctions should return true for a given object who only has method props`, () => {
  t.falsy(allPropsAreFunctions({}))
  t.truthy(allPropsAreFunctions({a: () => {}}))
  t.truthy(allPropsAreFunctions({a: () => {}, b: () => {}}))
  t.falsy(allPropsAreFunctions({a: () => {}, b: () => {}, c: false}))
})

/* eslint-enable fp/no-unused-expression */
