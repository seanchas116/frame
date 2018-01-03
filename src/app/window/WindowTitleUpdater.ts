import * as path from 'path'
import * as Electron from 'electron'
import { computed, autorun } from 'mobx'
import { fileStore } from '../state/FileStore'
import { Disposable, disposeAll } from '../../core/common/Disposable'

export class WindowTitleUpdater {
  private disposables: Disposable[]

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
