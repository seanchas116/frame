import * as path from 'path'
import * as Electron from 'electron'
import { computed, autorun } from 'mobx'
import { fileStore } from '../file/FileStore'
import { Disposable, disposeAll } from '../../lib/Disposable'

export class WindowTitleUpdater {
  private disposables: Disposable[]

  @computed private get windowTitle () {
    const filePath = fileStore.file.path
    const zoomPercentage = fileStore.document.scroll.scale * 100
    return (filePath ? path.basename(filePath) : 'Untitled') + ` - ${zoomPercentage}%`
  }

  @computed private get representedFilePath () {
    return fileStore.file.path || ''
  }

  @computed private get isDocumentEdited () {
    return fileStore.file.isModified
  }

  constructor () {
    this.disposables = [
      autorun(() => {
        const win = Electron.remote.getCurrentWindow()
        win.setTitle(this.windowTitle)
        win.setRepresentedFilename(this.representedFilePath)
        win.setDocumentEdited(this.isDocumentEdited)
      })
    ]
  }

  dispose () {
    disposeAll(this.disposables)
  }
}

export const windowTitleUpdater = new WindowTitleUpdater()
