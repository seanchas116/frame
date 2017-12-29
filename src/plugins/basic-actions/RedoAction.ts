import { computed } from 'mobx'
import { Action } from '../../app/state/Action'
import { editor } from '../../editor/state/Editor'

export class RedoAction implements Action {
  id = 'edit.redo'
  defaultKey = 'CommandOrControl+Y'

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
