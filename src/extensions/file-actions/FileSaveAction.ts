import { Action } from '../../app/state/Action'
import { fileStore } from '../../app/state/FileStore'
import { showSaveDialog } from './Dialog'

export class FileSaveAction implements Action {
  id = 'file.save'
  defaultKey = 'Control+S'
  defaultKeyMac = 'Command+S'
  title = 'Save'
  enabled = true

  async run () {
    fileStore.file.save(showSaveDialog)
  }
}
