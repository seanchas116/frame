import { Document } from '../document/Document'
import { Format } from '../format/Format'
import { V1Format } from '../format/v1/V1Format'

export class File {
  readonly format: Format = new V1Format()
  constructor (public readonly document: Document) {
  }
}
