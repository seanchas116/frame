import { Action, registerAction } from '../../core/action/Action'
import { fileStore } from './FileStore'
import { fileNew } from '../ActionIDs'

@registerAction
export class FileNewAction implements Action {
  id = fileNew
  defaultKey = 'Control+N'
  defaultKeyMac = 'Command+N'
  title = 'New'
  enabled = true

  run () {
    fileStore.open()
  }
}
