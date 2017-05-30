const R = require(`ramda`)
const nodePath = require(`path`)
const {
  handrail
} = require(`./index`)

const getNestedPath = R.path([`v2`, `filename`])
const relative = R.curry((a, b) => nodePath.relative(a, b))

// const xtrace = R.curry((l, a, b) => { l(a, b); return b })
// const trace = xtrace(console.log)

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

const failingFiles = files.concat([false, null, 20])
/*
// these will fail:
makeAllRelativePaths(dir, failingFiles)
*/
const notObject = (x) => typeof x !== `object`

const expectAllObjects = (x) => ([
  `Expected to be given all objects,`,
  `instead received: ${x.filter(notObject).join(`, `)}`
]).join(` `)
const errorize = (x) => (new Error(x))

const safeMakeRelative = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    expectAllObjects,
    makeAllRelativePaths(directory),
    fileList
  )
)

const safeMakeRelativeWithStack = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    R.pipe(expectAllObjects, errorize),
    makeAllRelativePaths(directory),
    fileList
  )
)

/* eslint-disable fp/no-unused-expression */
/* eslint-disable no-console */
console.log(`#1.`, makeAllRelativePaths(dir, files))
console.log(`#2.`, safeMakeRelative(dir, failingFiles))
console.log(`#3.`, safeMakeRelativeWithStack(dir, failingFiles))
/* eslint-enable fp/no-unused-expression */
/* eslint-enable no-console */
