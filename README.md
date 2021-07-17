![handrail](https://cdn.rawgit.com/brekk/handrail/56db4bd/logo.svg)

a toolset for adding safety to your functional pipelines

Please read the [accompanying post](https://codepen.io/brekk/post/3c7f65946d644e17ef37d30a9ba4cd15/visual-function-composition) for more in depth explanation.

This utility adds [logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction) / [railway-oriented programming](https://fsharpforfunandprofit.com/rop) to your functional pipelines.

_NB: See this file in a runnable form here: [example.literate.js](https://cdn.rawgit.com/brekk/handrail/56db4bd/example.literate.js)_

## Install

    yarn add handrail -S

or

    npm i handrail -S

## Use

Here's an all-in-one example where we can make an unsafe function safer while not modifying the original:

```js
import {guideRail, fold} from 'handrail'
import pipe from 'ramda/src/pipe'

// here are two potential error cases
const over21 = ({age}) => age > 20
const hasMoney = ({cash}) => cash - 5 >= 0

// and these are the cases we pass to the end, before folding
const growUp = (user) => `Expected ${user.name} to be 21!`
const getAJob = (user) => `Expected ${user.name} to have at least 5 dollars!`

// here's our original function, which has some errors in its assumptions
const bartenderOfIllRepute = (user) => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}

// here's how we fix it with `guideRail`
const bartenderOfGoodRepute = pipe(
  guideRail(
    [
      // add safety for age!
      [over21, growUp],
      // add safety for cash!
      [hasMoney, getAJob]
      // add more!
    ],
    // alter the Either value
    bartenderOfIllRepute
  ),
  // this just pulls our value out from the Either (see the [fold API](https://github.com/brekk/handrail#fold) below)
  fold(I, I)
)
```

## Example

Here's a contrived problem that `handrail` can help us solve:

1.  Jimmy and Alice want to go drinking, but Jimmy isn't of legal drinking age.


    ```js
    const resetUsers = () => ({
      alice: {name: `alice`, cash: 15, age: 22},
      jimmy: {name: `jimmy`, cash: 20, age: 20}
    })

    let {alice, jimmy} = resetUsers()

2.  There's an unscrupulous bartender (in the form of a function) who doesn't enforce the rules.

```js
const unscrupulousBartender = (user) => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}

console.log(`=== example one ===`)
console.log(`alice goes to the bar`, unscrupulousBartender(alice))
// {name: `alice`, cash: 10, beverages: [`beer`], age: 22}
console.log(`jimmy goes to the bar`, unscrupulousBartender(jimmy))
// {name: `jimmy`, cash: 15, beverages: [`beer`], age: 20}
```

3.  But we're part of a team that's trying to crack down on unscrupulous bartenders, and we'd like to use `handrail` to solve this problem.

```js
// import {handrail} from "handrail"
const {handrail} = require(`./handrail`)

const ageAttentiveBartender = handrail(
  (user) => user.age > 20,
  (user) => `Expected ${user.name} - (age: ${user.age}) to be at least 21.`,
  unscrupulousBartender
)

console.log(`=== example two ===`)
console.log(`alice goes to the bar behaving legally`, ageAttentiveBartender(alice))
// { r: { name: 'alice', cash: 5, age: 22, beverages: [ 'beer', 'beer' ] } }
console.log(`jimmy goes to the bar behaving legally`, ageAttentiveBartender(jimmy))
// { l: 'Expected jimmy - (age: 20) to be at least 21.' }
```

Hey, now we're seeing an altered behavior, but why is this `{r/l}` object wrapped around our values?

This is an `Either`; it's either a Left or a Right. In either case, when we wanna grab a value out of the result, we simply have to use `fold` from 'handrail' to get a resolving value.

```js
// import {fold} from 'handrail'
const {fold} = require(`./handrail`)
```

`fold` takes three parameters. The first two are functions, the first is invoked when the value is a Left, and the other is invoked when the value is a Right. Finally, the last parameter is an Either (Left / Right). This is a curried function, so you can specify what to do as a resolution well before you have an Either.

```js
// here's a simple one
const logOrWarn = fold(console.error, console.log)
```

Now we can tack on this resolution value to our previously-error producing function using `pipe`

```js
const pipe = require(`ramda/src/pipe`)
const ageAttentiveBartender2 = pipe(ageAttentiveBartender, logOrWarn)

console.log(`=== example three ===`)
console.log(`alice goes to the bar behaving legally, round 2`)
ageAttentiveBartender2(alice)
/*
{ name: 'alice',
  cash: 0,
  age: 22,
  beverages: [ 'beer', 'beer', 'beer' ] }
*/
console.log(`jimmy goes to the bar behaving legally, round 2`)
ageAttentiveBartender2(jimmy)
```

Oh! Now we've added age-safety to our bar!

However, let's say that we've spotted another issue with our current function -- it doesn't care if the given user doesn't have cash to cover the beer.

```js
console.log(`=== example four ===`)
console.log(`alice can go into debt with the bar!`)
ageAttentiveBartender2(alice)
/*
{ name: 'alice',
  cash: -5,
  age: 22,
  beverages: [ 'beer', 'beer', 'beer', 'beer' ] }
*/
```

So, rather than continuing to make Alice more drunk and more in debt, let's call resetUsers:

```js
let soberUsers = resetUsers()
alice = soberUsers.alice
jimmy = soberUsers.jimmy
```

And let's see what we can do (relative to our original unscrupulousBartender implementation above) to add both age & cash safety to our function.

We'll use `rail` and `multiRail`, which will allow us to add more than one assertion / form of safety to our original bartending function:

```js
// import {rail, multiRail} from 'handrail'
const {rail, multiRail} = require(`./handrail`)
```

(NB: This example leans a little more heavily on an understanding of `pipe`, which is described in more detail [here](https://codepen.io/brekk/post/functional-workaholism#function-composition-7). Simple example: `pipe((x) => x + 5, (y) => y - 7)` is the same as a new function `(z) => z - 2`)

```js
/* for easier recall:
const unscrupulousBartender = (user) => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}
*/

// we need map so that we can alter things within the Either value
const map = require(`ramda/src/map`)

// let's establish our basic expectations
const usersShouldBe21 = ({age}) => age > 20
const usersShouldHaveCashToCoverABeer = ({cash}) => cash - 5 >= 0

// and the errors we have
const warnYoungsters = (user) => `Expected ${user.name} to be 21!`
const warnWouldBeDebtors = (user) => `Expected ${user.name} to have at least 5 dollars!`

const cashAndAgeSafeBartender = pipe(
  // add safety for age!
  rail(usersShouldBe21, warnYoungsters),
  // add safety for cash!
  // multiRail is identical to rail, but should only be used when rail is already being used
  multiRail(usersShouldHaveCashToCoverABeer, warnWouldBeDebtors),
  // alter the Either value, so wrap our original function in `map`
  map(unscrupulousBartender),
  // convert our Either value to a string and print it
  logOrWarn
)

console.log(`=== example five ===`)
console.log(`jimmy is rejected for being underage:`)
cashAndAgeSafeBartender(jimmy)
// Expected jimmy to be 21!
console.log(`alice buys beer until she is broke:`)
cashAndAgeSafeBartender(alice)
// { name: 'alice', cash: 10, age: 22, beverages: [ 'beer' ] }
cashAndAgeSafeBartender(alice)
// { name: 'alice', cash: 5, age: 22, beverages: [ 'beer', 'beer' ] }
cashAndAgeSafeBartender(alice)
// { name: 'alice', cash: 0, age: 22, beverages: [ 'beer', 'beer', 'beer' ] }
cashAndAgeSafeBartender(alice)
// Expected alice to have at least 5 dollars!
```

Finally, to round it out, you can use `guideRail` to automate the above process:

```js
const {guideRail} = require(`./handrail`)

const cashAndAgeSafeBartender2 = guideRail(
  [
    // add safety for age!
    [usersShouldBe21, warnYoungsters],
    // add safety for cash!
    [usersShouldHaveCashToCoverABeer, warnWouldBeDebtors]
    // add more!
  ],
  // alter the Either value
  unscrupulousBartender
)
```

### Changelog

-   [1.0.0](https://github.com/brekk/handrail/tree/v1.0.0) - initial commit
-   [1.0.3](https://github.com/brekk/handrail/tree/v1.0.3) - added null safety
-   [1.0.4](https://github.com/brekk/handrail/tree/v1.0.4) - started using `katsu-curry`
-   [1.0.5](https://github.com/brekk/handrail/tree/v1.0.5) - added `guideRail`
-   [1.1.5](https://github.com/brekk/handrail/tree/v1.1.5) - reduced total size
-   [1.2.0](https://github.com/brekk/handrail/tree/v1.2.0) - modularized codebase
-   [1.3.0](https://github.com/brekk/handrail/tree/v1.3.0) - updated dependencies
-   [1.3.3](https://github.com/brekk/handrail/tree/v1.3.3) - fix exports
-   [1.3.4](https://github.com/brekk/handrail/tree/v1.3.4) - swap to jest, update speeds

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### handrail

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** a function to test the input with
-   `wrongPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** a function to prepare data before it passes into the Left path
-   `rightPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** a function to modify after it passes into the Right path
-   `input` **any** any input

Returns **(GuidedLeft | GuidedRight)** an Either

#### rail

Add safety to your pipelines!

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** boolean-returning function
-   `wrongPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function invoked if the inputs are bad
-   `input` **any** any input

**Examples**

```javascript
import {rail} from 'handrail'
import pipe from 'ramda/src/pipe'
const divide = (a, b) => a / b
const safeDivide = curry((a, b) => pipe(
  rail(() => b !== 0, () => `Expected ${b} to not be zero!`),
  divide(a)
)(b)
```

Returns **(GuidedRight | GuidedLeft)** Left / Right -wrapped value

#### multiRail

`multiRail` is nearly-identical to `rail`, but should only be used if `rail` is already in use
This is a useful function if you need very granular control of your pipe. If not, you should
probably use `guideRail` instead.

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** boolean-returning function
-   `wrongPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function invoked if the inputs are bad
-   `input` **any** any input

**Examples**

```javascript
import {rail, multiRail} from 'handrail'
import pipe from 'ramda/src/pipe'
const divide = (a, b) => a / b
const safeDivide = curry((a, b) => pipe(
  rail(() => (typeof a === `number`), () => `Expected ${a} to be a number!`),
  multiRail(() => (typeof b === `number`), () => `Expected ${b} to be a number!`)
  multiRail(() => b !== 0, () => `Expected ${b} to not be zero!`),
  divide(a)
)(b)
```

Returns **(GuidedRight | GuidedLeft)** Left / Right -wrapped value

#### guideRail

Encapsulate error states in a simple structure that returns a Left on error or Right on success

**Parameters**

-   `rails` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;functions>** an array of [assertion, failCase] pairs
-   `goodPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** what to do if things go well
-   `input` **any** whatever

**Examples**

```javascript
import pipe from 'ramda/src/pipe'
import {guideRail, fold} from 'handrail'
const identity = (x) => x
const rails = [
  [({age}) => age > 20, ({name}) => `Expected ${name} to be 21.`],
  [({cash}) => cash - 5 >= 0, ({name}) => `Expected ${name} to have cash.`],
]
const bartender = (user) => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}
const cashAndAgeSafeBartender = pipe(
  guideRail(rails, bartender),
  fold(identity, identity)
)
```

Returns **(GuidedLeft | GuidedRight)** an Either

#### bimap

**Parameters**

-   `leftPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** do something if function receives a Left
-   `rightPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** do something if function receives a Right
-   `either` **Either** either a Left or a Right

Returns **Either** the original Either, mapped over, but like, with handed-ness

#### fold

**Parameters**

-   `leftPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** do something if function receives a Left
-   `rightPath` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** do something if function receives a Right
-   `either` **Either** either a Left or a Right

Returns **any** the value from within an Either, pulled out of the monadic box
