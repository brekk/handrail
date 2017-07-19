import {isFunction, isObject} from 'f-utility'

export const isEither = (x) => x && isObject(x) && x.fold && isFunction(x.fold)
export const isRight = (x) => isEither(x) && x.r
export const isLeft = (x) => isEither(x) && x.l
