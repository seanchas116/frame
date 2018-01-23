import { computed } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'
import { editRedo } from '../ActionIDs'

@registerAction
export class RedoAction implements Action {
  id = editRedo
  defaultKey = 'Control+Y'
  defaultKeyMac = 'Shift+Command+Z'

  @computed get title () {
    const { commandToRedo } = Document.current.undoStack
    return commandToRedo ? `Redo ${commandToRedo.title}` : 'Redo'
  }

  @computed get enabled () {
    return Document.current.undoStack.canRedo
  }

  run () {
    Document.current.undoStack.redo()
  }
}
