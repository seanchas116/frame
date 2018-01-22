import { Action, registerAction } from '../action/Action'
import { fileStore } from './FileStore'
import { showSaveDialog } from './Dialog'

@registerAction
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
