import { Document } from '../../core/document/Document'
import { V1Format } from '../../core/format/v1/V1Format'
import { observable, reaction } from 'mobx'
import * as fs from 'fs'

const fileFormat = new V1Format()

export class File {
  @observable path: string | undefined = undefined
  get isModified () { return this._isModified }
  @observable private _isModified = false

  constructor (public readonly document: Document) {
    reaction(() => document.undoStack.commandToUndo, () => this._isModified = true)
  }

  static async open (path: string) {
    const data = fs.readFileSync(path)
    const document = await fileFormat.deserialize(data)
    document.clearHistory()
    const file = new File(document)
    file.path = path
    return file
  }

  async save (askFilePath: () => string | undefined) {
    if (!this._isModified) {
      return
    }
    if (this.path) {
      this.saveToPath(this.path)
    } else {
      this.saveAs(askFilePath)
    }
  }

  async saveAs (askFilePath: () => string | undefined) {
    const path = askFilePath()
    if (path) {
      this.saveToPath(path)
      this.path = path
    }
  }

  private async saveToPath (path: string) {
    const data = await fileFormat.serialize(this.document)
    fs.writeFileSync(path, data)
    this._isModified = false
  }
}
