import {e2} from 'entrust'

/**
 * @method bimap
 * @param {function} leftPath - do something if function receives a Left
 * @param {function} rightPath - do something if function receives a Right
 * @param {Either} either - either a Left or a Right
 * @returns {Either} the original Either, mapped over, but like, with handed-ness
 * @public
 */
export const bimap = e2(`bimap`)
