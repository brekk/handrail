import {I, curryObjectK, pipe, isFunction as isFn, reject} from 'f-utility'
import length from 'ramda/src/length'
// import reject from 'ramda/src/reject'
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
