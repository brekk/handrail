import {Left as _Left} from 'fantasy-eithers'
// import {Ok as _Left} from 'folktale/result'
import {guided} from './guided'

export const Left = _Left
export const GuidedLeft = guided(Left)
