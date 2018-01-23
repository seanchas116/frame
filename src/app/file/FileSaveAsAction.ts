import { Action, registerAction } from '../../core/action/Action'
import { fileStore } from './FileStore'
import { showSaveDialog } from './Dialog'
import { fileSaveAs } from '../ActionIDs'

@registerAction
export class FileSaveAsAction implements Action {
  id = fileSaveAs
  defaultKey = 'Shift+Control+S'
  defaultKeyMac = 'Shift+Command+S'
  title = 'Save As...'
  enabled = true

  async run () {
    fileStore.file.saveAs(showSaveDialog)
  }
}
