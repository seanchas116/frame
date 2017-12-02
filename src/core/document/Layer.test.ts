import { assert } from 'chai'
import { Layer } from './Layer'

describe('Layer', () => {
  describe('parent', () => {
    it('is automatically set', () => {
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
})
