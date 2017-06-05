import curry from 'ramda/src/curry'
import pipe from 'ramda/src/pipe'
import length from 'ramda/src/length'
import allPass from 'ramda/src/allPass'
import prop from 'ramda/src/prop'
import reject from 'ramda/src/reject'
import all from 'ramda/src/all'
import propSatisfies from 'ramda/src/propSatisfies'

export const judgement = curry(
  (deliberation, jury, law, accused) => pipe(
    law,
    deliberation,
    jury
  )(accused)
)

export const judgeObject = curry(
  (deliberation, jury, law, accused) => judgement(
    pipe(deliberation, Object.keys),
    jury,
    law,
    accused
  )
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
