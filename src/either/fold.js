import {e2} from 'entrust'
/**
 * @method fold
 * @param {function} leftPath - do something if function receives a Left
 * @param {function} rightPath - do something if function receives a Right
 * @param {Either} either - either a Left or a Right
 * @returns {*} the value from within an Either, pulled out of the monadic box
 * @public
 */
export const fold = e2(`fold`)
