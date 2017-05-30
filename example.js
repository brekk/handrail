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
    // trace(`inputs`),
    // the cunning ones amongst you know we can collapse these two maps
    R.map(
      getNestedPath
    ),
    // trace(`log`),
    R.map(
      relative(directory)
    )
    // trace(`relativized`)
  )(fileList)
)

const gen = (filename) => ({
  v2: {
    filename
  }
})
const files = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(``).map(gen)

const dir = `./hey/cool/pants/`
console.log(makeAllRelativePaths(dir, files)) // eslint-disable-line

const failingFiles = files.concat([false, null, 20])
/*
// these will fail:
makeAllRelativePaths(dir, failingFiles)
*/
const notObject = (x) => typeof x !== `object`

const safeMakeRelative = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => `Expected to be given all objects, instead received: ${x.filter(notObject).join(`, `)}`,
    makeAllRelativePaths(directory),
    fileList
  )
)
console.log(safeMakeRelative(dir, failingFiles)) // eslint-disable-line

const safeMakeRelativeWithStack = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => new Error(`Expected to be given all objects, instead received: ${x.filter(notObject).join(`, `)}`),
    makeAllRelativePaths(directory),
    fileList
  )
)

console.log(safeMakeRelativeWithStack(dir, failingFiles)) // eslint-disable-line
