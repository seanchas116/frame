import { assert } from 'chai'
import { UndoStack, UndoCommand } from './UndoStack'

class ExampleCommand implements UndoCommand {
  constructor (public title: string) {}

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
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      assert(undoStack.canUndo)
      undoStack.undo()
      undoStack.undo()
      assert(!undoStack.canUndo)
    })
  })

  describe('#canRedo', () => {
    it('returns if the stack can redo', () => {
      assert(!undoStack.canRedo)
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      assert(!undoStack.canRedo)
      undoStack.undo()
      undoStack.undo()
      assert(undoStack.canRedo)
      undoStack.push(new ExampleCommand('hoge'))
      assert(!undoStack.canRedo)
    })
  })
})
