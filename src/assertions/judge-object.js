import {I, curryObjectK, pipe} from 'f-utility'

export const judgement = curryObjectK(
  [`jury`, `law`, `input`],
  ({
    input,
    law,
    pre = I,
    deliberation = I,
    post = I,
    jury
  }) => pipe(
    law,
    pre,
    deliberation,
    post,
    jury
  )(input)
)
