import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { map } from 'ramda'
// import shebang from 'rollup-plugin-add-shebang'
import pkg from './package.json'

const external = (pkg && pkg.dependencies
  ? Object.keys(pkg.dependencies)
  : []
).concat([`path`])

const plugins = [
  json(),
  resolve({ preferBuiltins: true }),
  commonjs()
]

const build = (input, name) => [
  {
    input,
    external,
    output: [
      { name, file: name + '.js', format: 'cjs' },
      { name, file: name + '.mjs', format: 'esm' }
    ],
    plugins
  },
  {
    input,
    output: [{ name, file: name + '.umd.js', format: 'umd' }],
    plugins
  }
]

const toBuild = [
  ...build(`src/index.js`, pkg.name),
  ...build(`src/debug.js`, `debug`)
]

export default toBuild
