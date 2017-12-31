import { remote } from 'electron'

export async function showSaveDialog () {
  const filePath = await new Promise<string | undefined>((resolve, reject) => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
      title: 'Save As...',
      filters: [{
        name: 'Frame Document',
        extensions: ['frame']
      }]
    }, resolve)
  })
  if (filePath) {
    return filePath[0]
  }
}
