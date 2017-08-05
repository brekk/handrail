import {map as _map, chain as _chain} from 'f-utility'

export const map = _map
export const chain = _chain

export * from './handrail'
export * from './rail'
export * from './multirail'
export * from './guiderail'
export * from './either/index'

// Extended metaphor API
export {rail as baluster} from './rail'
export {handrail as balustrade} from './handrail'
export {fold as net} from './either/fold'
