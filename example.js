const R = require(`ramda`)
const nodePath = require(`path`)
const {
handrail
} = require(`./index`)

const getNestedPath = R.path([`v2`, `filename`])
const relative = R.curry((a, b) => nodePath.relative(a, b))

const xtrace = R.curry((l, a, b) => { l(a, b); return b })
const trace = xtrace(console.log)

const makeAllRelativePaths = R.curry(
  (directory, fileList) => R.pipe(
    trace(`inputs`),
    // the cunning ones amongst you know we can collapse these two maps
    R.map(
      getNestedPath
    ),
    trace(`log`),
    R.map(
      relative(directory)
    ),
    trace(`relativized`)
  )(fileList)
)

const gen = (filename) => ({
  v2: {
    filename
  }
})
const files = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(``).map(gen)

const dir = `./hey/cool/pants/`
makeAllRelativePaths(dir, files)

const failingFiles = files.concat([false, null, 20])
/*
// these will fail:
makeAllRelativePaths(dir, failingFiles)
*/

const safeMakeRelative = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => `Expected to be given objects, instead received: ` + x.filter(
      (f) => typeof f !== `object`
    ),
    makeAllRelativePaths(directory),
    fileList
  )
)
safeMakeRelative(dir, failingFiles)
