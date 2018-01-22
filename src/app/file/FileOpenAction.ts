import * as Electron from 'electron'
import { Action, registerAction } from '../../core/action/Action'
import { fileStore } from './FileStore'

@registerAction
export class FileOpenAction implements Action {
  id = 'file.open'
  defaultKey = 'Control+O'
  defaultKeyMac = 'Command+O'
  title = 'Open...'
  enabled = true

  async run () {
    const filePaths = await new Promise<string[] | undefined>((resolve, reject) => {
      Electron.remote.dialog.showOpenDialog(Electron.remote.getCurrentWindow(), {
        title: 'Open',
        filters: [{
          name: 'Frame Document',
          extensions: ['frame']
        }]
      }, resolve)
    })
    if (!filePaths || filePaths.length === 0) {
      return
    }
    fileStore.open(filePaths[0])
  }
}
