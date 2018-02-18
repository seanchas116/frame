import { assert } from 'chai'
import { ValueRange } from './ValueRange'

describe('ValueRange', () => {
  describe('#length', () => {
    it('returns difference of end and begin', () => {
      const range = new ValueRange(10, 30)
      assert.equal(range.length, 20)
    })
  })
  describe('#union', () => {
    it('returns union', () => {
      const range1 = new ValueRange(10, 30)
      const range2 = new ValueRange(20, 50)
      const union = range1.union(range2)
      assert.deepEqual(union, new ValueRange(10, 50))
    })
  })
  describe('#intersection', () => {
    it('returns intersection', () => {
      const range1 = new ValueRange(10, 30)
      const range2 = new ValueRange(20, 50)
      const intersection = range1.intersection(range2)
      assert.deepEqual(intersection, new ValueRange(20, 30))
    })
    it('returns undefined if there is no intersection', () => {
      const range1 = new ValueRange(10, 30)
      const range2 = new ValueRange(40, 50)
      const intersection = range1.intersection(range2)
      assert.equal(intersection, undefined)
    })
  })
  describe('.fromValues', () => {
    it('creates range from value', () => {
      const range = ValueRange.fromValues(100, 200, -100, 500, 400)
      assert.deepEqual(range, new ValueRange(-100, 500))
    })
  })
})
