import { Action, registerAction } from '../../core/action/Action'
import { fileStore } from './FileStore'
import { showSaveDialog } from './Dialog'

@registerAction
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
