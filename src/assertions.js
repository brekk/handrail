import {I, curry, curryObjectK, pipe} from 'katsu-curry'
import length from 'ramda/src/length'
import allPass from 'ramda/src/allPass'
import prop from 'ramda/src/prop'
import reject from 'ramda/src/reject'
import all from 'ramda/src/all'
import propSatisfies from 'ramda/src/propSatisfies'

export const judgement = curryObjectK(
  [`jury`, `law`, `input`],
  ({
    jury,
    law,
    input,
    deliberation = I,
    pre = I,
    post = I
  }) => {
    return pipe(
      law,
      pipe(pre, deliberation, post),
      jury
    )(input)
  }
)

export const judgeObject = curryObjectK(
  [`jury`, `law`, `input`],
  ({
    jury,
    law,
    input,
    pre = I,
    post = I
  }) => judgement({
    deliberation: Object.keys,
    pre,
    post,
    jury,
    law,
    input
  })
)

const type = curry(
  function Ｘtype(t, x) { return typeof x === t } // eslint-disable-line valid-typeof
)
export const isObject = type(`object`)
export const isFn = type(`function`)
export const rejectNonFunctions = reject(isFn)
// const propIsObject = propSatisfies(isObject)
export const propIsFn = propSatisfies(isFn)
export const allPropsAreFunctions = pipe(
  reject(isFn),
  Object.keys,
  length,
  (x) => x === 0
)
export const allFunctions = all(isFn)

export const isEither = allPass([
  isObject,
  propIsFn(`fold`)
])
export const isRight = allPass([
  isEither,
  prop(`r`)
])
export const isLeft = allPass([
  isEither,
  prop(`l`)
])
