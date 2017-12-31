import { Action } from '../../app/state/Action'
import { fileStore } from '../../app/state/FileStore'
import { showSaveDialog } from './Dialog'

export class FileSaveAsAction implements Action {
  id = 'file.saveAs'
  defaultKey = 'Shift+Control+S'
  defaultKeyMac = 'Shift+Command+S'
  title = 'Save As...'
  enabled = true

  async run () {
    fileStore.file.saveAs(showSaveDialog)
  }
}
