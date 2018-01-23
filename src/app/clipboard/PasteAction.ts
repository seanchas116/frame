import { Action, registerAction } from '../../core/action/Action'
import { editPaste } from '../ActionIDs'

@registerAction
export class PasteAction implements Action {
  id = editPaste
  defaultKey = 'Control+V'
  defaultKeyMac = 'Command+V'
  title = 'Paste'
  enabled = true

  run () {
    // TODO
  }
}
