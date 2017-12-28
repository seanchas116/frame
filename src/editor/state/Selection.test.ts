import { assert } from 'chai'
import { Editor } from './Editor'
import { Document } from '../../core/document/Document'

describe('Selection', () => {
  let editor: Editor
  let document: Document
  beforeEach(() => {
    editor = new Editor()
    document = editor.document
  })
  describe('layers', () => {
    it('returns selected layers sorted', () => {
      const layer1 = document.createLayer()
      const layer2 = document.createLayer()
      const layer3 = document.createLayer()
      const leakedLayer = document.createLayer()
      layer2.children.push(layer3)
      editor.layers.push(layer1, layer2)

      editor.selection.add(layer3)
      editor.selection.add(layer1)
      editor.selection.add(leakedLayer)

      assert.deepEqual(editor.selection.layers, [layer1, layer3])
    })
  })
})
