import { Document } from '../document/Document'

export interface Format {
  serialize (document: Document): Promise<Buffer>
  deserialize (buffer: Buffer): Promise<Document>
}
