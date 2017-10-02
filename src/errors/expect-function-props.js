import {curry} from 'f-utility'

const plural = (x) => (
  x.length > 1 ?
    `s` :
    ``
)

/**
 * @method expectFunctionProps
 * @param {string} scope - string that gives scope to the error
 * @param {string[]} errors - a list of error(s)
 * @returns {Error} an error
 * @private
 */
export const expectFunctionProps = curry((scope, errors) => (
  new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
))
