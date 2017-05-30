/* eslint-disable max-len */
/* eslint-disable no-unused-expression */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
## handrail
### a toolset for adding safety to your functional pipelines

**This module is very much a work-in-progress!**

Please read the [accompanying post](https://codepen.io/brekk/post/3c7f65946d644e17ef37d30a9ba4cd15/visual-function-composition) for more in depth explanation.

This utility adds [logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction) / [railway-oriented programming](https://fsharpforfunandprofit.com/rop) to your functional pipelines.

Largely this utility sits on top of `fantasy-eithers`, which provides the Either functionality we rely upon.

See the below example problem in a form that runs in node in [./example.js](./example.js)

(_NB_ - The below context assumes some familiarity with functional composition and currying, if you would like to read more, see [this post](https://codepen.io/brekk/post/functional-workaholism))

Let's say I have a contrived problem: I want to grab the value `x` from my object, if it exists.
*/

const getX = (a) => a.x // equivalent to R.prop(`x`)
console.log(getX({
  x: `x literal`
})) // "x literal"

/**
This is an ok start, but we're expecting an object input, so this function will return undefined if we give it an unexpected input, like a string literal or a number:
*/

console.log(getX(100)) // undefined
console.log(getX(`whatever`)) // undefined

/**
Let's say the scope of our original contrived problem changes, now we want to access a nested value:
*/

const getX2 = (a) => a.v2.x // equivalent to R.path([`v2`, `x`])
console.log(getX2({
  v2: {
    x: 1000
  }
})) // 1000

/**
As you are probably aware, now we can get errors to throw with bad inputs:
*/

try {
  getX2(10000)
} catch (e) {
  // console.log(e) // TypeError: Cannot read property 'x' of undefined
}

/**
While we're dealing with this problem, it turns out there's a new memo from the powers that be about the contrived problem, and now it has some meat: now we need a function which:

1. can grab the nested `v2.filename` property from a specific list of objects that represent file paths
2. must let us know if that filename property doesn't exist, _without throwing an error_
3. must, if the filename property does exist, return a relative version of that filename, given string `relative`

How can we solve this nicely?

To start, let's add Ramda or a similar functional library:
*/

import R from 'ramda'

/**
Next, to address the first point and the third point (with some handwaving), we can simply do (apologies for the potential confusion around using both `Ramda.path` and `path`, used an alias for that reason):
*/

import nodePath from 'path'

const getNestedPath = R.path([`v2`, `filename`])
const relative = R.curry((a, b) => nodePath.relative(a, b))

// const xtrace = R.curry((l, a, b) => { l(a, b); return b })
// const trace = xtrace(console.log)

const makeAllRelativePaths = R.curry(
  (directory, fileList) => R.pipe(
    // trace(`inputs`),
    // the cunning ones amongst you know we can collapse these two maps,
    R.map(
      getNestedPath
    ),
    // but we keep them like this for debugging
    // trace(`nested pull`),
    R.map(
      relative(directory)
    )
    // trace(`relativized`)
  )(fileList)
)

/**
Cool. So with good inputs, we can do this:
*/

const gen = (filename) => ({
  v2: {
    filename: filename + `.js`
  }
})
const files = `ABCDE`.split(``).map(gen) // a simple generated list
const dir = `./hey/cool/pants/`
// #1 (See `./example.js`, ⌘+F > #1.)
makeAllRelativePaths(dir, files) // [`../../../A.js`, ...etc]

/**
Great! So now what happens if we change our harness to add some stuff we **know** won't work?
*/

const failingFiles = files.concat([420, true, `uhhhhh wait`])
try {
  makeAllRelativePaths(dir, failingFiles)
} catch (e) {
  // console.log(e) // TypeError: Path must be a string. Received undefined
}

/**
Barf-o-rama. 😑

Finally, we get to the point of this README!

#### Using handrail to add safety

We can use *handrail* to solve our problems!
*/

// import {handrail} from 'handrail'

const notObject = (o) => typeof o !== `object`
const safeMakeRelative = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => `Expected to be given all objects, instead received: ${x.filter(notObject).join(`, `)}`,
    makeAllRelativePaths(directory),
    fileList
  )
)

// #2 (See `./example.js`, ⌘+F > #2.)
safeMakeRelative(dir, failingFiles) // {r: `Expected to be given all objects, instead received: 420, true, 'uhhhhh wait'` }

/**
#### Return errors instead of literals in the Left path

_NB: If you need to deal with an error stack, you can have the second parameter return an Error:_
*/

const safeMakeRelativeWithStack = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => new Error(`Expected to be given all objects, instead received: ${x.filter(notObject).join(`, `)}`),
    makeAllRelativePaths(directory),
    fileList
  )
)
// #3 (See `./example.js`, ⌘+F > #3.)
console.log(`#3.`, safeMakeRelativeWithStack(dir, failingFiles).l.message)

/**
Now we can safely pass in a bad dataset, and it won't fail, it'll just return a string! (Ish.)

#### Get values from an Either

**Q**: So, the output is wrapped in this `{r: value}` structure (or, if something broke, a `{l: value}` structure), how do we get the raw value out?

**A**: Use `fold` / `net`! This allows us to take the existing Either value and return it back to a raw value.
*/

import {
  Right,
  fold, // alias 'net'
  rail, // alias 'baluster'
  handrail // alias 'balustrade'
} from './index'
// - or -
// import {net} from 'handrail'

/**
By folding / netting an Either, we can pull the boxed value out of the Either.

In many cases, this can just be the identity function `(x) => x`:
*/

const myEither = Right(`my value`)
const value = fold(R.identity, R.identity, myEither) // my value

/**
Because `fold` / `net` are curried, however, you can make much more declarative functions, where you express what you want to do with a good / bad value independently of the value itself.
*/

// I wouldn't recommend alerting, but you _could_ if you wanted.
const alert = typeof window !== `undefined` ? window.alert : R.identity
const getEntitiesOrAlert = fold(alert, R.path([`body`, `entities`]))

/**
However, as the situation warrants, you may well want to hook an Either to a global toast / messaging service or similar:
*/

const addToast = R.identity
const valueOrToast = fold(addToast, R.identity)

/**
Finally, if you want to cleave to the imperative world you may be more familiar with:
*/

// this is gross, but you could do it
const throwOrReturn = fold((x) => { throw x }, R.identity)

/**
#### Adding your own rail

Perhaps you need to make sure that you're more in control of your pipeline than `handrail` affords. `handrail` is basically some syntactic sugar around this notion:
*/

// import {rail} from 'handrail'
export const basicallyHandrail = R.curry(
  (safety, badPath, goodPath, x) => R.pipe(
    rail(safety, badPath),
    R.map(goodPath)
  )(x)
)

/**
As you can see, if you need, you simply need to add `rail` to your pipeline, and then as long as you're using something like `Ramda.map` (which delegates the `map` method correctly), you can `map` | `ap` | `chain` | `fold` as you need to.

#### Adding more than one rail

Wow, `rail` and `handrail` are cool!

**Q**: What happens if I have more than one point of failure?

**A**: Use `multiRail`! (For those of you more well-versed in FP, `multiRail = chain(rail(safety, badPath))`)

(Better example forthcoming here.)
*/
/* eslint-enable max-len */
/* eslint-enable no-unused-expression */
/* eslint-enable no-unused-vars */
/* eslint-enable no-console */
