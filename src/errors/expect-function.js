import {curry} from 'katsu-curry'

const plural = (x) => x.length > 1 ? `s` : ``

/**
 * @method expectFn
 * @param {string} scope - string that gives scope to the error
 * @param {string[]} errors - a list of error(s)
 * @returns {Error} an error
 * @private
 */
export const expectFn = curry((scope, errors) => (
  new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
))
