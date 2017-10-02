import {Left as _Left} from 'fantasy-eithers'
import {guided} from '@either/guided'

export const Left = _Left
export const GuidedLeft = guided(Left)
