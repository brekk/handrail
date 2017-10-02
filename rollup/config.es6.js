const path = require(`path`)
const pkg = require(`../package.json`)
const {bundle} = require(`germs`)

const external = (
  pkg && pkg.dependencies ?
    Object.keys(pkg.dependencies) :
    []
)

const local = (x) => path.resolve(__dirname, x)

module.exports = bundle({
  name: pkg.name,
  external,
  input: `src/index.js`,
  alias: {
    [`@handrail`]: local(`../src`),
    [`@assertions`]: local(`../src/assertions`),
    [`@either`]: local(`../src/either`),
    [`@errors`]: local(`../src/errors`)
  },
  output: {
    file: `./${pkg.name}.mjs`,
    format: `es`
  }
})
