import { isFunction, expectFunction } from "./utils"

test("isFunction", () => {
  expect(isFunction("shit")).toBeFalsy()
  expect(isFunction(() => {})).toBeTruthy()
})

test("expectFunction", () => {
  expect(expectFunction(["shit", "shit"])).toEqual("shit")
  expect(expectFunction(["shit", () => {}])).toBeFalsy()
})
