import * as Electron from 'electron'
import * as querystring from 'querystring'
import { observable, reaction, runInAction } from 'mobx'
import { File } from './File'
import { Document } from '../../core/document/Document'

export class FileStore {
  @observable file = new File(new Document())
  get document () { return this.file.document }

  constructor () {
    reaction(() => this.document, document => {
      Document.current = document
    })
    reaction(() => this.file.path, path => {
      Electron.ipcRenderer.send('filePathChange', path)
    })
    this.openFileFromHash()
    Document.current = this.document
  }

  async open (path?: string) {
    if (this.file.isEmpty) {
      const file = path ? await File.open(path) : File.new()
      runInAction(() => this.file = file)
    } else {
      Electron.ipcRenderer.send('newWindow', path)
    }
  }

  private async openFileFromHash () {
    if (location.hash) {
      const opts = querystring.parse(location.hash.slice(1))
      if (opts.filePath) {
        // TODO: handle error
        const file = await File.open(opts.filePath as string)
        runInAction(() => this.file = file)
      }
    }
  }
}

export const fileStore = runInAction(() => new FileStore())
