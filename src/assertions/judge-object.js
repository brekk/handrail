import {I, curryObjectK, pipe} from 'f-utility'

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
