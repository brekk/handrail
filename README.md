```
 _                     _           _ _
| |__   __ _ _ __   __| |_ __ __ _(_) |
| '_ \ / _` | '_ \ / _` | '__/ _` | | |
| | | | (_| | | | | (_| | | | (_| | | |
|_| |_|\__,_|_| |_|\__,_|_|  \__,_|_|_|
```

## handrail
### a toolset for adding safety to your functional pipelines

**This module is very much a work-in-progress!**

Let's say I have a contrived problem: I want to grab the value `x` from my object, if it exists.

```js
const getX = (a) => a.x // equivalent to R.prop(`x`)
console.log(getX({x: `x literal`})) // "x literal"
```

This is an ok start, but we're expecting an object input, so this function will return undefined if we give it an unexpected input, like a string literal or a number:

```js
const getX = (a) => a.x // equivalent to R.prop(`x`)
console.log(getX(100)) // undefined
console.log(getX(`whatever`)) // undefined
```

Let's say the scope of our original contrived problem changes, now we want to access a nested value:

```js
const getX2 = (a) => a.v2.x // equivalent to R.path([`v2`, `x`])
console.log(getX2({v2: {x: 420}})) // 420
```

As you are probably aware, now we can get errors to throw with bad inputs:

```js
const getX2 = (a) => a.v2.x // equivalent to R.path([`v2`, `x`])
console.log(getX2(420)) // TypeError: Cannot read property 'x' of undefined
```

While we're dealing with this problem, it turns out there's a new memo from the powers that be about the contrived problem, and now it has some meat: now we need a function which:

1. can grab the nested `v2.filename` property from a specific list of objects that represent file paths
2. must let us know if that filename property doesn't exist, _without throwing an error_
3. must, if the filename property does exist, return a relative version of that filename, given string `relative`

How can we solve this nicely?

To start, let's add Ramda or a similar functional library:

```js
import R from 'ramda'
```

Next, to address the first point and the third point (with some handwaving), we can simply do (apologies for the potential confusion around using both `Ramda.path` and `path`, used an alias for that reason):

```js
import path as nodePath from 'path'
import R from 'ramda'

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
    ),
    // trace(`relativized`)
  )(fileList)
)
```

Cool. So with good inputs, we can do this:

```js
const gen = (filename) => ({v2: {filename: filename + `.js` }})
const files = `ABCDE`.split(``).map(gen) // a simple generated list
const dir = `./hey/cool/pants/`
makeAllRelativePaths(dir, files) // [`../../../A.js`, ...etc]
```

Great! So now what happens if we change our harness to add some stuff we **know** won't work?

```js
const failingFiles = files.concat([420, true, `uhhhhh wait`])
makeAllRelativePaths(dir, failingFiles) // TypeError: Path must be a string. Received undefined
```

Barf-o-rama. 😑

Finally, we get to the point of this README!

We can use *handrail* to solve our problems!

```js
import {handrail} from 'handrail'
const makeAllRelativePaths = R.curry(
  (directory, files) => R.map(
    R.pipe(
      getNestedPath,
      relative(directory)
    ),
    files
  )
)
const notObject = (o) => typeof o !== `object`
const safeMakeRelative = R.curry(
  (directory, fileList) => handrail(
    getNestedPath,
    (x) => `Expected to be given objects, instead received: ${x.filter(notObject).join(`, `)}`,
    makeAllRelativePaths(directory),
    fileList
  )
)

safeMakeRelative(dir, failingFiles) // Expected to be given objects, instead received: 420, true, `uhhhhh wait`
```

Now we can safely pass in a bad dataset, and it won't fail, it'll just return a string!
