import { computed } from 'mobx'
import { Action } from '../../app/state/Action'
import { editor } from '../../editor/state/Editor'

export class UndoAction implements Action {
  id = 'edit.undo'
  defaultKey = 'Control+Z'
  defaultKeyMac = 'Command+Z'

  @computed get title () {
    const { commandToUndo } = editor.document.undoStack
    return commandToUndo ? `Undo ${commandToUndo.title}` : 'Undo'
  }

  @computed get enabled () {
    return editor.document.undoStack.canUndo
  }

  run () {
    editor.document.undoStack.undo()
  }
}
