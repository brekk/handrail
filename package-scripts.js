const curry = require(`ramda/src/curry`)
const utils = require(`nps-utils`)
const {version} = require(`./package.json`)

const prepend = curry((toPrepend, file) => `echo "${toPrepend} $(cat ${file})" > ${file}`)
const append = curry((toAppend, file) => `echo "${toAppend}" >> ${file}`)
const createWithText = curry((text, file) => `echo "${text}" > ${file}`)
const {
  concurrent: all,
  series,
  mkdirp
} = utils
const {
  nps: allNPS
} = all
const COSTFILE = `./costs`
const MINIFIED = `./dist/handrail.min.js`
const MINIFIED_BROWSER = `./dist/handrail.browser.min.js`
module.exports = {
  scripts: {
    build: {
      description: `do a per file conversion from /src to /lib`,
      files: {
        description: `convert files`,
        script: `babel src -d lib --ignore *.spec.js`
      },
      script: allNPS(
        `build.files`,
        `buildWithRollup`
      )
    },
    buildWithRollup: {
      description: `generate executable`,
      script: series(
        `rollup -c config/commonjs.js`,
        mkdirp(`dist`),
        `browserify --node -s handrail ./lib/index.js > ${MINIFIED_BROWSER}`,
        `uglifyjs --compress --mangle -o ${MINIFIED} -- ./lib/index.js`,
        `uglifyjs --compress --mangle -o ${MINIFIED_BROWSER} -- ${MINIFIED_BROWSER}`,
        prepend(`/* handrail v.${version} */`, MINIFIED),
        prepend(`/* handrail v.${version} */`, MINIFIED_BROWSER)
      )
    },
    cost: {
      description: `regenerate the costfile`,
      script: series(
        createWithText(`binoculars cost`, COSTFILE),
        append(`\`cost-of-modules --no-install --yarn\``, COSTFILE),
        `cat ./costs`
      )
    },
    dist: {
      description: `generate files`,
      script: `nps build`
    },
    lint: {
      description: `lint the javascript files`,
      script: `eslint src/**`
    },
    mkdir: {
      coverage: `mkdirp coverage`,
      description: `generate a coverage directory`
    },
    precommit: {
      description: `the tasks auto-run before commits`,
      script: allNPS(`dist`, `test`, `cost`, `regenerate.readme`)
    },
    publish: {
      description: `the tasks to run at publish-time`,
      script: allNPS(`build`, `regenerate.readme`)
    },
    test: {
      description: `run lint and tests`,
      script: allNPS(`lint`, `test.covered`),
      covered: {
        description: `run covered tests`,
        script: `nyc ava --verbose src/*.spec.js`
      },
      log: {
        description: `run tests and save logfile`,
        script: `npm run test:covered > test-output.log`
      },
      readme: {
        description: `run tests on the example that generates the README`,
        script: `ava example.literate.js`
      }
    },
    regenerate: {
      readme: {
        description: `run ljs2 against example.literate.js to get our README.md file regenerated`,
        script: `ljs2 example.literate.js -o README.md`
      }
    }
  }
}
