import ʹmap from 'ramda/src/map'
import ʹchain from 'ramda/src/chain'
import {
  rail as ʹrail,
  handrail as ʹhandrail
} from './handrail'

import {
  Right as ʹRight,
  Left as ʹLeft,
  GuidedRight as ʹGuidedRight,
  GuidedLeft as ʹGuidedLeft,
  isRight as ʹisRight,
  isLeft as ʹisLeft,
  fold as ʹfold,
  ap as ʹap,
  bimap as ʹbimap
} from './util'

export const rail = ʹrail
export const handrail = ʹhandrail

export const Right = ʹRight
export const Left = ʹLeft
export const GuidedRight = ʹGuidedRight
export const GuidedLeft = ʹGuidedLeft
export const isRight = ʹisRight
export const isLeft = ʹisLeft
export const chain = ʹchain
export const map = ʹmap
export const fold = ʹfold
export const ap = ʹap
export const bimap = ʹbimap

// extended metaphor API
export const baluster = rail
export const balustrade = handrail
export const net = fold
