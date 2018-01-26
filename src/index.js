import {map as _map, chain as _chain} from 'f-utility'

export const map = _map
export const chain = _chain

export {
  handrail
} from './handrail'
export * from './rail'
export * from './multirail'
export * from './guiderail'
export * from '@either/index'

// Extended metaphor API
export {rail as baluster} from '@handrail/rail'
export {handrail as balustrade} from '@handrail/handrail'
export {fold as net} from '@either/fold'
