import { Document } from '../../core/document/Document'
import { Format } from '../../core/format/Format'
import { V1Format } from '../../core/format/v1/V1Format'

export class File {
  readonly format: Format = new V1Format()
  constructor (public readonly document: Document) {
  }
}
