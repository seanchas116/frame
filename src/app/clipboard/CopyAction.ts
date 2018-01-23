import { Action, registerAction } from '../../core/action/Action'
import { editCopy } from '../ActionIDs'

@registerAction
export class CopyAction implements Action {
  id = editCopy
  defaultKey = 'Control+C'
  defaultKeyMac = 'Command+C'
  title = 'Copy'
  enabled = true

  run () {
    // TODO
  }
}
