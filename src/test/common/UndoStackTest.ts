import { assert } from 'chai'
import { UndoStack, UndoCommand } from '../../core/common/UndoStack'

class ExampleCommand implements UndoCommand {
  undo () {
    // TODO
  }
  redo () {
    // TODO
  }
}

describe('UndoStack', () => {
  let undoStack: UndoStack<ExampleCommand>
  beforeEach(() => {
    undoStack = new UndoStack()
  })

  describe('#canUndo', () => {
    it('returns if the stack can undo', () => {
      undoStack.push(new ExampleCommand())
      undoStack.push(new ExampleCommand())
      assert(undoStack.canUndo)
      undoStack.undo()
      undoStack.undo()
      assert.notOk(undoStack.canUndo)
    })
  })
})
