import pipe from 'ramda/src/pipe'
import K from 'ramda/src/always'
import curry from 'ramda/src/curry'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'

import {
  isFn,
  GuidedLeft,
  GuidedRight,
  allFunctions
} from './util'

/*
const xtrace = curry((l, a, b) => {
  l(a, b) // eslint-disable-line
  return b
})
const trace = xtrace(console.log)
// */

// add safety to your pipes!

export const rail = curry(
  (safety, divider, input) => {
    if (!isFn(safety)) {
      return GuidedLeft(`rail: Expected safety to be a function.`)
    }
    if (!isFn(divider)) {
      return GuidedLeft(`rail: Expected divider to be a function.`)
    }
    return (
      safety(input) ?
      GuidedRight :
      pipe(divider, GuidedLeft)
    )(input)
  }
)

export const multiRail = curry(
  (safety, divider, input) => chain(
    rail(safety, divider),
    input
  )
)

const safeWarn = curry((safety, badPath, goodPath) => {
  if (!isFn(safety)) {
    return `handrail: Expected safety to be a function.`
  }
  if (!isFn(badPath)) {
    return `handrail: Expected badPath to be a function.`
  }
  if (!isFn(goodPath)) {
    return `handrail: Expected goodPath to be a function.`
  }
})

const internalRailSafety = curry(
  (safety, badPath, goodPath) => rail(
    K(allFunctions([safety, badPath, goodPath])),
    K(safeWarn(safety, badPath, goodPath))
  )
)

export const handrail = curry(
  (safety, badPath, goodPath, input) => pipe(
    internalRailSafety(safety, badPath, goodPath),
    multiRail(safety, badPath),
    map(goodPath)
  )(input)
)
