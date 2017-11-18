import { Document } from '../../document/Document'
import { DocumentData } from './Schema'
import { documentToData } from './Serialize'
import { dataToDocument } from './Deserialize'

export class File {
  readonly document: Document

  constructor (data?: DocumentData) {
    if (data) {
      this.document = dataToDocument(data)
    } else {
      this.document = new Document()
    }
  }

  toData (): DocumentData {
    return documentToData(this.document)
  }
}
