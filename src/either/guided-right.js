import {Right as _Right} from 'fantasy-eithers'
// import {Error as _Right} from 'folktale/result'
import {guided} from './guided'

export const Right = _Right
export const GuidedRight = guided(Right)
