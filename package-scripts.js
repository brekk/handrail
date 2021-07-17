module.exports = {
  scripts: {
    lint: `eslint src/*.js`,
    rollup: `rollup -c rollup.config.js`,
    build: `nps rollup`,
    bundle: `nps build`,
    test: {
      script: 'jest',
      description: 'test stuff',
      snapshot: 'nps "test -u"',
      coverage: 'nps "test --coverage"'
    },
    care: "nps lint test bundle"
  }
}
