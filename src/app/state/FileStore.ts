import * as Electron from 'electron'
import * as querystring from 'querystring'
import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../../core/document/Document'

export class FileStore {
  @observable file = new File(new Document())
  get document () { return this.file.document }

  constructor () {
    this.openFileFromHash()
  }

  openInNewWindow (path?: string) {
    Electron.ipcRenderer.send('newWindow', path)
  }

  private async openFileFromHash () {
    if (location.hash) {
      const opts = querystring.parse(location.hash.slice(1))
      if (opts.filePath) {
        // TODO: handle error
        this.file = await File.open(opts.filePath as string)
      }
    }
  }
}

export const fileStore = new FileStore()
