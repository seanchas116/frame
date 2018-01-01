import { assert } from 'chai'
import { Document } from '../../core/document/Document'

describe('Selection', () => {
  let document: Document
  beforeEach(() => {
    document = document
  })
  describe('layers', () => {
    it('returns selected layers sorted', () => {
      const layer1 = document.createLayer()
      const layer2 = document.createLayer()
      const layer3 = document.createLayer()
      const leakedLayer = document.createLayer()
      layer2.children.push(layer3)
      document.rootGroup.children.push(layer1, layer2)

      document.selection.add(layer3)
      document.selection.add(layer1)
      document.selection.add(leakedLayer)

      assert.deepEqual(document.selection.layers, [layer1, layer3])
    })
  })
})
