import * as Electron from 'electron'
import * as querystring from 'querystring'
import { observable, reaction } from 'mobx'
import { File } from './File'
import { Document } from '../../core/document/Document'
import { editor } from '../../editor/state/Editor'

export class FileStore {
  @observable file = new File(new Document())
  get document () { return this.file.document }

  constructor () {
    reaction(() => this.document, document => {
      editor.document = document
    })
    reaction(() => this.file.path, path => {
      Electron.ipcRenderer.send('filePathChange', path)
    })
    this.openFileFromHash()
    editor.document = this.document
  }

  async open (path?: string) {
    if (this.file.isEmpty) {
      if (path) {
        this.file = await File.open(path)
      } else {
        this.file = new File(new Document())
      }
    } else {
      Electron.ipcRenderer.send('newWindow', path)
    }
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
