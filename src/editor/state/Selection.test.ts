import { assert } from 'chai'
import { Editor } from './Editor'
import { Layer } from '../../core/document/Layer'

describe('Selection', () => {
  let editor: Editor
  beforeEach(() => {
    editor = new Editor()
  })
  describe('layers', () => {
    it('returns selected layers sorted', () => {
      const layer1 = new Layer()
      const layer2 = new Layer()
      const layer3 = new Layer()
      const leakedLayer = new Layer()
      layer2.children.push(layer3)
      editor.layers.push(layer1, layer2)

      editor.selection.add(layer3)
      editor.selection.add(layer1)
      editor.selection.add(leakedLayer)

      assert.deepEqual(editor.selection.layers, [layer1, layer3])
    })
  })
})
