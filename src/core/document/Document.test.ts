import { assert } from 'chai'
import { createDocument } from './test/Fixture'

describe('Document', () => {
  describe('#commit', () => {
    it('makes layer change undoable', () => {
      const document = createDocument()
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
})
