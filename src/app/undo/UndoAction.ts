import { computed } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'

@registerAction
export class UndoAction implements Action {
  id = 'edit.undo'
  defaultKey = 'Control+Z'
  defaultKeyMac = 'Command+Z'

  @computed get title () {
    const { commandToUndo } = Document.current.undoStack
    return commandToUndo ? `Undo ${commandToUndo.title}` : 'Undo'
  }

  @computed get enabled () {
    return Document.current.undoStack.canUndo
  }

  run () {
    Document.current.undoStack.undo()
  }
}
