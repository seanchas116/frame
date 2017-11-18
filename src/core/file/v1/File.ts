import { Document } from '../../document/Document'
import { DocumentData } from './Schema'
import { documentToData } from './Serialize'
import { dataToDocument } from './Deserialize'

export class File {
  constructor (public readonly document: Document) {
  }

  async newFile () {
    return new File(new Document())
  }

  async fromData (data: DocumentData) {
    return new File(await dataToDocument(data))
  }

  toData (): DocumentData {
    return documentToData(this.document)
  }
}
