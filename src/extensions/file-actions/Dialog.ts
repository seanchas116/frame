import { remote } from 'electron'

export function showSaveDialog () {
  return new Promise<string | undefined>((resolve, reject) => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
      title: 'Save As...',
      filters: [{
        name: 'Frame Document',
        extensions: ['frame']
      }]
    }, resolve)
  })
}
