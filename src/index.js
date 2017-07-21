import {_map} from 'f-utility'
import _chain from 'ramda/src/chain'
import assert from './either/assert'

export const map = _map
export const chain = _chain

export * from './handrail'
export * from './rail'
export * from './multirail'
export * from './guiderail'
export * from './either/index'

export const assertions = assert

// Extended metaphor API
export {rail as baluster} from './rail'
export {handrail as balustrade} from './handrail'
export {fold as net} from './either/fold'
