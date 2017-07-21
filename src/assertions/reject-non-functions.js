import {isFunction, reject} from 'f-utility'
export const rejectNonFunctions = reject(isFunction)
