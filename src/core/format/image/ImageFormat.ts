import { Format } from '../Format'
import { Document } from '../../document/Document'

export abstract class ImageFormat implements Format {
  abstract readonly extensions: ReadonlyArray<string>
  abstract readonly mime: string
  abstract readonly uti: string
  readonly isLayered = false

  async serialize (document: Document): Promise<Buffer> {
    throw new Error('TODO')
  }

  async deserialize (buffer: Buffer): Promise<Document> {
    throw new Error('TODO')
  }
}
