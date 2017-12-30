import { File } from './File'
import { Document } from '../../core/document/Document'

export class FileStore {
  readonly file = new File(new Document())
  get document () { return this.file.document }
}

export const fileStore = new FileStore()
