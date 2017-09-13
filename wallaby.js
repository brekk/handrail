const pkg = require(`./package.json`)
module.exports = function configureWallaby(wallaby) {
  return {
    name: pkg.name,
    files: [
      `src/**/*.js`,
      `src/*.js`
    ],

    tests: [
      `tests/**/*.spec.js`,
      `tests/*.spec.js`
    ],

    env: {
      type: `node`,
      kind: `electron`
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    testFramework: `jest`,

    setup: function setupWallaby() {
      require(`babel-polyfill`) // eslint-disable-line fp/no-unused-expression
    },

    debug: true,
    filesWithNoCoverageCalculated: [
      // `src/core/fs.js`
    ]
  }
}
