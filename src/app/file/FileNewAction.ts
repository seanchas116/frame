import { Action, registerAction } from '../action/Action'
import { fileStore } from './FileStore'

@registerAction
export class FileNewAction implements Action {
  id = 'file.new'
  defaultKey = 'Control+N'
  defaultKeyMac = 'Command+N'
  title = 'New'
  enabled = true

  run () {
    fileStore.open()
  }
}
