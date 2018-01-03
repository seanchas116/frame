import * as path from 'path'
import * as Electron from 'electron'
import { computed, autorun } from 'mobx'
import { fileStore } from '../state/FileStore'

export class WindowTitleUpdater {
  private disposers: (() => void)[]

  @computed private get windowTitle () {
    const filePath = fileStore.file.path
    return filePath ? path.basename(filePath) : 'Untitled'
  }

  @computed private get representedFilePath () {
    return fileStore.file.path || ''
  }

  @computed private get isDocumentEdited () {
    return fileStore.file.isModified
  }

  constructor () {
    this.disposers = [
      autorun(() => {
        const win = Electron.remote.getCurrentWindow()
        win.setTitle(this.windowTitle)
        win.setRepresentedFilename(this.representedFilePath)
        win.setDocumentEdited(this.isDocumentEdited)
      })
    ]
  }

  dispose () {
    this.disposers.forEach(d => d())
  }
}
