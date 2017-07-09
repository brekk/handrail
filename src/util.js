import {e1, e2} from 'entrust'
import E from 'fantasy-eithers'
import {curry} from 'katsu-curry'
import {isEither} from './assertions'

export const ap = e1(`ap`)
export const bimap = e2(`bimap`)
export const fold = e2(`fold`)

export const guided = curry(function Ｘguided(direction, x) {
  return (
    isEither(x) ?
    x :
    direction(x)
  )
})
export const {
  Right,
  Left
} = E

export const GuidedRight = guided(Right)
export const GuidedLeft = guided(Left)

export const plural = (x) => x.length > 1 ? `s` : ``
