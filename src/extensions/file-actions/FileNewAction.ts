import { Action } from '../../app/state/Action'
import { fileStore } from '../../app/state/FileStore'

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
