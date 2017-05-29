const base = require(`./rollup.config.base`)
/* eslint-disable fp/no-mutating-assign */
module.exports = Object.assign(base, {
  dest: `lib/handrail.js`,
  entry: `src/handrail.js`,
  format: `cjs`
})
/* eslint-enable fp/no-mutating-assign */
