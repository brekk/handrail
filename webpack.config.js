module.exports = {
  resolve: {
    extensions: [`.js`, `.json`],
    modules: [
      `${__dirname}/node_modules`
    ],
    alias: {
      "@handrail": `${__dirname}`,
      "@assertions": `${__dirname}/src/assertions`,
      "@either": `${__dirname}/src/either`,
      "@errors": `${__dirname}/src/errors`
    }
  }
}
