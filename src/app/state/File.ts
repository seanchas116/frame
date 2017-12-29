import { Document } from '../../core/document/Document'
import { Format } from '../../core/format/Format'
import { V1Format } from '../../core/format/v1/V1Format'
import { observable, reaction } from 'mobx'
import * as fs from 'fs'

export class File {
  readonly format: Format = new V1Format()
  @observable path: string | undefined = undefined
  get isModified () { return this._isModified }
  @observable private _isModified = false

  constructor (public readonly document: Document) {
    reaction(() => document.undoStack.commandToUndo, () => this._isModified = true)
  }

  async save () {
    if (!this._isModified) {
      return
    }
    if (this.path) {
      const data = await this.format.serialize(this.document)
      fs.writeFileSync(this.path, data)
      this._isModified = false
    } else {
      throw new Error('path is not specified')
    }
  }
}
