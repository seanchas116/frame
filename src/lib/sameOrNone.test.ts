import { assert } from 'chai'
import { sameOrNone } from './sameOrNone'
import { Vec2 } from 'paintvec'

describe('sameOrNone', () => {
  describe('for array with same values', () => {
    it('returns the same value', () => {
      const array = [3, 3, 3, 3]
      const result1 = sameOrNone(array)
      assert.equal(result1, 3)
      const points = [new Vec2(4, 4), new Vec2(4, 4), new Vec2(4, 4)]
      const result2 = sameOrNone(points, (p1, p2) => p1.equals(p2))
      assert.deepEqual(result2, new Vec2(4, 4))
    })
  })
  describe('for array with different values', () => {
    it('returns undefined', () => {
      const array = [3, 4, 3, 3]
      const result1 = sameOrNone(array)
      assert.equal(result1, undefined)
      const points = [new Vec2(4, 3), new Vec2(4, 4), new Vec2(4, 4)]
      const result2 = sameOrNone(points, (p1, p2) => p1.equals(p2))
      assert.deepEqual(result2, undefined)
    })
  })
  describe('for empty array', () => {
    it('returns undefined', () => {
      const result = sameOrNone([])
      assert.equal(result, undefined)
    })
  })
})
