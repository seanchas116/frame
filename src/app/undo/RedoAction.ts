import { computed } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { editor } from '../editor/Editor'

@registerAction
export class RedoAction implements Action {
  id = 'edit.redo'
  defaultKey = 'Control+Y'
  defaultKeyMac = 'Shift+Command+Z'

  @computed get title () {
    const { commandToRedo } = editor.document.undoStack
    return commandToRedo ? `Redo ${commandToRedo.title}` : 'Redo'
  }

  @computed get enabled () {
    return editor.document.undoStack.canRedo
  }

  run () {
    editor.document.undoStack.redo()
  }
}
