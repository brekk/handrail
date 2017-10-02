import {curry} from 'f-utility'
import {isEither} from '@either/assert'

export const guided = curry(function guide(direction, x) {
  return (
    isEither(x) ?
      x :
      direction(x)
  )
})
