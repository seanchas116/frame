import { Document } from '../document/Document'

export interface Format {
  readonly extensions: ReadonlyArray<string>
  readonly mime: string
  readonly uti: string
  readonly isLayered: boolean
  serialize (document: Document): Promise<Buffer>
  deserialize (buffer: Buffer): Promise<Document>
}
