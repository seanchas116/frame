import { assert } from 'chai'
import { Layer } from './Layer'
import { createShapeLayer } from './test/Fixture'

describe('Layer', () => {
  describe('parent', () => {
    it('is automatically set when inserted to new parent', () => {
      const parent = new Layer()
      const child1 = new Layer()
      const child2 = new Layer()
      parent.children.push(child1)
      assert.equal(child1.parent, parent)
      parent.children[0] = child2
      assert.equal(child1.parent, undefined)
      assert.equal(child2.parent, parent)
      parent.children.clear()
      assert.equal(child2.parent, undefined)
    })
  })
  describe('children', () => {
    it('removes child automatically when child is inserted to another parent', () => {
      const parent1 = new Layer()
      const parent2 = new Layer()
      const child = new Layer()
      parent1.children.push(child)
      assert.deepEqual([...parent1.children], [child])
      parent2.children.push(child)
      assert.deepEqual([...parent1.children], [])
      assert.deepEqual([...parent2.children], [child])
    })
  })
  describe('clone', () => {
    it('clones layer', () => {
      const layer = createShapeLayer()
      const cloned = layer.clone()
      const layerWithoutKey = { ...layer, key: -1 }
      const clonedWithoutKey = { ...cloned, key: -1 }
      assert.deepEqual(layerWithoutKey, clonedWithoutKey)
    })
  })
})
