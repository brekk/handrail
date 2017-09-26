const germs = require(`germs`)
const {name} = require(`./package.json`)

const utils = require(`nps-utils`)
const {
  series
} = utils

module.exports = germs(name, {
  readme: {
    description: `regenerate readme`,
    script: series(`nps readme.generate`, `nps readme.api`),
    generate: {
      description: `run ljs2 against example.literate.js to get our README.md file regenerated`,
      script: `ljs2 example.literate.js -o README.md`
    },
    api: {
      description: `add API readme to the README`,
      script: `documentation readme -s "API" src/index.js`
    }
  }
})
