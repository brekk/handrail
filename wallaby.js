module.exports = function runWallaby(wallaby) {
  return {
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    debug: true,
    env: {
      runner: `node`,
      type: `node`
    },
    files: [
      `src/**/*.js`,
      `!src/**/*.spec.js`
    ],

    setup: function setup() {
      require(`babel-polyfill`) // eslint-disable-line
    },
    testFramework: `ava`,
    tests: [
      `src/**/*.spec.js`
    ]
  }
}
