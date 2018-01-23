import { computed } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'
import { editUndo } from '../ActionIDs'

@registerAction
export class UndoAction implements Action {
  id = editUndo
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
