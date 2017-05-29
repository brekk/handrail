const progress = require(`rollup-plugin-progress`)
const commonjs = require(`rollup-plugin-commonjs`)
// const shebang = require(`rollup-plugin-shebang`)
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
    R: `ramda`
  },
  moduleName: pkg.name,
  plugins: [
    progress(),
    commonjs({
      extensions: [`.js`],
      include: `node_modules/**`,
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/ramda/all.js': [ `all` ],
        'node_modules/ramda/always.js': [ `K` ],
        'node_modules/ramda/allPass.js': [ `allPass` ],
        'node_modules/ramda/curry.js': [ `curry` ],
        'node_modules/ramda/chain.js': [ `chain` ],
        'node_modules/ramda/prop.js': [ `prop` ],
        'node_modules/ramda/propSatisfies.js': [ `propSatisfies` ],
        'node_modules/ramda/pipe.js': [ `pipe` ],
        'node_modules/ramda/map.js': [ `map` ],
        'node_modules/ramda/identity.js': [ `identity` ],
        'node_modules/fantasy-eithers/index.js': [ `E` ]
      }
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    json(),
    buble()
    // shebang()
  ],
  sourceMap: true
}
