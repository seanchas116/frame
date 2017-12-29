import { Document } from '../../core/document/Document'
import { Format } from '../../core/format/Format'
import { V1Format } from '../../core/format/v1/V1Format'
import { observable, reaction } from 'mobx'
import * as fs from 'fs'

export class File {
  readonly format: Format = new V1Format()
  @observable isModified = false
  @observable path: string | undefined = undefined

  constructor (public readonly document: Document) {
    reaction(() => document.undoStack.commandToUndo, () => this.isModified = true)
  }

  async save () {
    if (!this.isModified) {
      return
    }
    if (this.path) {
      const data = await this.format.serialize(this.document)
      fs.writeFileSync(this.path, data)
      this.isModified = false
    } else {
      throw new Error('path is not specified')
    }
  }
}
