import { Action, registerAction } from '../../core/action/Action'
import { editCut } from '../ActionIDs'

@registerAction
export class CutAction implements Action {
  id = editCut
  defaultKey = 'Control+X'
  defaultKeyMac = 'Command+X'
  title = 'Cut'
  enabled = true

  run () {
    // TODO
  }
}
