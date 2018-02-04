import { assert } from 'chai'
import { Document } from '../document/Document'
import { Layer } from '../document/Layer'

describe('Selection', () => {
  let document: Document
  beforeEach(() => {
    document = new Document()
  })
  describe('layers', () => {
    it('returns selected layers sorted', () => {
      const layer1 = new Layer()
      const layer2 = new Layer()
      const layer3 = new Layer()
      const leakedLayer = new Layer()
      layer2.children.push(layer3)
      document.rootGroup.children.push(layer1, layer2)

      document.selection.add(layer3)
      document.selection.add(layer1)
      document.selection.add(leakedLayer)

      assert.deepEqual(document.selection.layers, [layer1, layer3])
    })
  })
})
