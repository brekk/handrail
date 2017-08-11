/* global expect */
export const t = {
  plan: (x) => expect.assertions(x),
  is: (a, b) => expect(a).toBe(b),
  not: (a, b) => expect(a).not.toBe(b),
  deepEqual: (a, b) => expect(a).toEqual(b),
  notDeepEqual: (a, b) => expect(a).not.toEqual(b),
  truthy: (x) => expect(x).toBeTruthy(),
  true: (x) => expect(x).toBe(true),
  falsy: (x) => expect(x).toBeFalsy(),
  false: (x) => expect(x).toBe(false),
  throws: (x, y) => expect(x).toThrow(y)
}
