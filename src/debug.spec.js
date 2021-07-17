import { rail } from "./debug"
import { hook } from "ripjam/test"
import Either from "easy-street"

const { riptest } = hook()

describe("rail - debug mode", () => {
  const notANumber = "no number whatsoever"
  const quick = riptest(rail)
  quick(
    "the single failure case works",
    [null, () => notANumber, "cool"],
    Either.Left(`Expected condition to be a function.`)
  )
  quick(
    "the multi failure case works",
    [null, null, "cool"],
    Either.Left(`Expected condition and badPath to be functions.`)
  )
})
