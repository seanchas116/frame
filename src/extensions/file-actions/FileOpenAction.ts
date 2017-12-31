import * as Electron from 'electron'
import { Action } from '../../app/state/Action'
import { fileStore } from '../../app/state/FileStore'

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
    fileStore.openInNewWindow(filePaths[0])
  }
}
