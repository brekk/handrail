const pkg = require(`./package.json`)

module.exports = function configureWallaby(wallaby) {
  return {
    name: pkg.name,
    debug: true,
    files: [
      `src/*.js`,
      `src/**/*.js`,
      `!src/*.spec.js`
    ],

    tests: [
      `src/*.spec.js`
    ],

    env: {
      type: `node`,
      runner: `node`
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    testFramework: `jest`,

    setup: function setup(w) {
      let jestConfig = require(`./package.json`).jest
      for (let p in jestConfig.moduleNameMapper) {
        jestConfig.moduleNameMapper[p] = jestConfig.moduleNameMapper[p].replace(
          `<rootDir>`, w.projectCacheDir
        )
      }
      w.testFramework.configure(jestConfig)
      /* eslint-enable */
    },
    filesWithNoCoverageCalculated: [
      // `src/core/fs.js`
    ]
  }
}
