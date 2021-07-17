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

const build = ({ input, file, format }) => ({
  input,
  external,
  output: [{ file, format }],
  plugins
})

export default map(build, [
  {
    input: `src/index.js`,
    file: pkg.main,
    format: `cjs`
  },
  {
    input: `src/index.js`,
    file: 'handrail.mjs',
    format: `esm`
  },
  {
    input: `src/debug.js`,
    external,
    file: 'debug.js',
    format: `cjs`
  },
  {
    input: `src/debug.js`,
    file: 'debug.mjs',
    format: `esm`
  }
])
