import { assert } from 'chai'
import { createDocument, createShapeLayer } from './test/Fixture'
import { Document } from './Document'
import { Layer } from './Layer'

describe('Document', () => {
  describe('#commit', () => {
    it('makes layer change undoable', () => {
      const document = createDocument()
      document.clearHistory()
      const layer = document.rootGroup.children[1]

      layer.name = 'Name Changed'
      document.commit('Change Layer Name')
      assert.equal(layer.name, 'Name Changed')
      assert.equal(document.undoStack.commandToUndo!.title, 'Change Layer Name')

      document.undoStack.undo()
      assert.equal(layer.name, 'Layer')

      document.undoStack.redo()
      assert.equal(layer.name, 'Name Changed')
    })
    it('makes layer move undoable', () => {
      const document = createDocument()
      document.clearHistory()
      const layer = document.rootGroup.children[3]
      const group = document.rootGroup.children[2]

      group.children.splice(0, 0, layer)
      document.commit('Move Layer')
      assert.deepEqual(layer.path, [2, 0])
      assert.equal(document.undoStack.commandToUndo!.title, 'Move Layer')

      document.undoStack.undo()
      assert.deepEqual(layer.path, [3])

      document.undoStack.redo()
      assert.deepEqual(layer.path, [2, 0])
    })
  })
  describe('#insertLayers', () => {
    let document: Document
    let layers: Layer[]
    beforeEach(() => {
      document = createDocument()
      document.selection.add(document.rootGroup.children[1])
      document.selection.add(document.rootGroup.children[2])
      layers = [
        createShapeLayer(document),
        createShapeLayer(document)
      ]
      document.insertLayers(layers)
    })

    it('inserts layers before first selected item', () => {
      assert.equal(document.rootGroup.children[1], layers[0])
      assert.equal(document.rootGroup.children[2], layers[1])
      assert.equal(document.rootGroup.children[3], document.selection.layers[0])
      assert.equal(document.rootGroup.children[4], document.selection.layers[1])
    })
  })
})
