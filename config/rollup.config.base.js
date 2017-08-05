const progress = require(`rollup-plugin-progress`)
const babili = require(`rollup-plugin-babili`)
const uglify = require(`rollup-plugin-uglify`)
const commonjs = require(`rollup-plugin-commonjs`)
const cleanup = require(`rollup-plugin-cleanup`)
const resolve = require(`rollup-plugin-node-resolve`)
const buble = require(`rollup-plugin-buble`)
const json = require(`rollup-plugin-json`)
const pkg = require(`../package.json`)
const external = Object.keys(pkg.dependencies)

module.exports = {
  exports: `named`,
  external,
  globals: {
    E: `fantasy-eithers`,
    F: `f-utility`
  },
  moduleName: pkg.name,
  plugins: [
    progress(),
    json(),
    buble(),
    commonjs({
      extensions: [`.js`],
      include: `node_modules/**`,
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        // 'ramda/all.js': [ `all` ]
      }
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    cleanup({
      comments: `none`
    }),
    babili({
      // removeConsole: true
    }),
    uglify()
  ]
}
