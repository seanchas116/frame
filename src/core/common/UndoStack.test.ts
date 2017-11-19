import { assert } from 'chai'
import { UndoStack, UndoCommand } from './UndoStack'

class ExampleCommand implements UndoCommand {
  static undoneCommand = ''
  static redoneCommand = ''

  constructor (public title: string) {}

  undo () {
    ExampleCommand.undoneCommand = this.title
  }
  redo () {
    ExampleCommand.redoneCommand = this.title
  }

}

describe('UndoStack', () => {
  let undoStack: UndoStack<ExampleCommand>
  beforeEach(() => {
    undoStack = new UndoStack()
  })

  describe('#commandToUndo', () => {
    it('returns command to be undone', () => {
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      assert.equal(undoStack.commandToUndo!.title, 'bar')
      undoStack.undo()
      undoStack.undo()
      assert.equal(undoStack.commandToUndo, undefined)
    })
  })

  describe('#commandToRedo', () => {
    it('returns command to be redone', () => {
      assert.equal(undoStack.commandToRedo, undefined)
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      assert.equal(undoStack.commandToRedo, undefined)
      undoStack.undo()
      undoStack.undo()
      assert.equal(undoStack.commandToRedo!.title, 'foo')
      undoStack.push(new ExampleCommand('hoge'))
      assert.equal(undoStack.commandToRedo, undefined)
    })
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

  describe('#undo', () => {
    it('undos last command', () => {
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      undoStack.undo()
      assert.equal(ExampleCommand.undoneCommand, 'bar')
      undoStack.undo()
      assert.equal(ExampleCommand.undoneCommand, 'foo')
      undoStack.redo()
      undoStack.redo()
      undoStack.undo()
      undoStack.redo()
      assert.equal(ExampleCommand.undoneCommand, 'bar')
    })
  })

  describe('#redo', () => {
    it('redos last undone command', () => {
      undoStack.push(new ExampleCommand('foo'))
      undoStack.push(new ExampleCommand('bar'))
      undoStack.undo()
      undoStack.undo()
      undoStack.redo()
      assert.equal(ExampleCommand.redoneCommand, 'foo')
      undoStack.redo()
      assert.equal(ExampleCommand.redoneCommand, 'bar')
      undoStack.push(new ExampleCommand('hoge'))
      undoStack.undo()
      undoStack.redo()
      assert.equal(ExampleCommand.redoneCommand, 'hoge')
    })
  })
})
