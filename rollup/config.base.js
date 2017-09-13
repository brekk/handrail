const alias = require(`rollup-plugin-alias`)
const progress = require(`rollup-plugin-progress`)
const babili = require(`rollup-plugin-babel-minify`)
const commonjs = require(`rollup-plugin-commonjs`)
const cleanup = require(`rollup-plugin-cleanup`)
const resolve = require(`rollup-plugin-node-resolve`)
const buble = require(`rollup-plugin-buble`)
const json = require(`rollup-plugin-json`)
const pkg = require(`../package.json`)
// console.log(`pkg`, pkg, pkg.dependencies)
const external = (
  pkg && pkg.dependencies ?
    Object.keys(pkg.dependencies) :
    []
)
// const {default: ts} = require(`rollup-plugin-ts`)
// const typescript = require(`typescript`)
// const tsconfig = require(`../tsconfig.json`)

module.exports = {
  exports: `named`,
  external,
  globals: {
  },
  name: pkg.name,
  plugins: [
    alias({
      [`@math`]: `./math`
    }),
    progress(),
    json(),
    // rollupAlias({tslib: `node_modules/tslib/tslib.es6.js`}),
    // ts({
    //   typescript,
    //   tsconfig: tsconfig.compilerOptions
    // }),
    commonjs({
      extensions: [`.js`],
      include: `node_modules/**`,
      namedExports: {
      }
    }),
    buble(),
    resolve({
      jsnext: true,
      main: true
    }),
    cleanup({
      comments: `none`
    }),
    babili({
      // removeConsole: true
    })
  ]
}
