![handrail](https://cdn.rawgit.com/brekk/handrail/56db4bd/logo.svg)

> a toolset for adding safety to your functional pipelines

**This module is very much a work-in-progress!**

Please read the [accompanying post](https://codepen.io/brekk/post/3c7f65946d644e17ef37d30a9ba4cd15/visual-function-composition) for more in depth explanation.

This utility adds [logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction) / [railway-oriented programming](https://fsharpforfunandprofit.com/rop) to your functional pipelines.

Largely this utility sits on top of `fantasy-eithers`, which provides the Either functionality we rely upon.

See this file in a runnable form here: [example.literate.js](https://cdn.rawgit.com/brekk/handrail/56db4bd/example.literate.js)

Here's a contrived problem that `handrail` can help us solve:

1.  Jimmy and Alice want to go drinking, but Jimmy isn't of legal drinking age.

```js
const resetUsers = () => ({
  alice: {name: `alice`, cash: 15, age: 22},
  jimmy: {name: `jimmy`, cash: 20, age: 20}
})

let {alice, jimmy} = resetUsers()
```

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
// import {handrail} from 'handrail'
const {handrail} = require(`./index`)

const ageAttentiveBartender = handrail(
  (user) => user.age > 20,
  (user) => `Expected ${user.name} - (age: ${user.age}) to be at least 21.`,
  unscrupulousBartender
)

console.log(`=== example two ===`)
console.log(`alice goes to the bar behaving legally`, ageAttentiveBartender(alice))
console.log(`jimmy goes to the bar behaving legally`, ageAttentiveBartender(jimmy))
```

Hey, now we're seeing an altered behavior, but why is this object wrapped around our values?

This is an `Either`; it's either a Left or a Right. In either case, when we wanna grab a value out of the result, we simply have to use `fold` from 'handrail' to get a resolving value.

```js
// import {fold} from 'handrail'
const {fold} = require(`./index`)
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
const {rail, multiRail} = require(`./index`)
```

(NB: This example leans a little more heavily on an understanding of `pipe`, which is described in more detail [here](https://codepen.io/brekk/post/functional-workaholism#function-composition-7). Simple example: `pipe((x) => x + 5, (y) => y - 7)` is the same as `(z) => z - 2`)

```js
/* for easier recall:
const unscrupulousBartender = (user) => {
  user.cash -= 5
  user.beverages = user.beverages || []
  user.beverages.push(`beer`)
  return user
}
*/

const map = require(`ramda/src/map`)

// let's establish our basic expectations
const usersShouldBe21 = ({age}) => age > 20
const usersShouldHaveCashToCoverABeer = ({cash}) => cash - 5 >= 0

// and the errors we have
const warnYoungsters = (user) => `Expected ${user.name} to be 21!`
const warnWouldBeDebtors = (user) => `Expected ${user.name} to have at least 5 dollars!`

const cashAndAgeSafeBartender = pipe(
  rail(usersShouldBe21, warnYoungsters),
  multiRail(usersShouldHaveCashToCoverABeer, warnWouldBeDebtors),
  map(unscrupulousBartender),
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

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### rail

Add safety to your pipelines!

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** boolean-returning function
-   `wrongPath` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function invoked if the inputs are bad
-   `input` **any** any input

Returns **(GuidedRight | GuidedLeft)** Left / Right -wrapped value

#### multiRail

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** boolean-returning function
-   `wrongPath` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function invoked if the inputs are bad
-   `input` **any** any input

Returns **(GuidedRight | GuidedLeft)** Left / Right -wrapped value

#### handrail

**Parameters**

-   `assertion` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function to test the input with
-   `wrongPath` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function to prepare data before it passes into the Left path
-   `rightPath` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a function to modify after it passes into the Right path
-   `input` **any** any input

Returns **(GuidedLeft | GuidedRight)** an Either
