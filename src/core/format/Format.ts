import { Document } from '../document/Document'
import { observable } from 'mobx'
import { Format } from './Format'

export interface Format {
  readonly extensions: ReadonlyArray<string>
  readonly mime: string
  readonly uti: string
  readonly isLayered: boolean
  serialize (document: Document): Promise<Buffer>
  deserialize (buffer: Buffer): Promise<Document>
}

export class FormatRegistry {
  private readonly formats = observable<Format>([])

  add (format: Format) {
    this.formats.push(format)
  }

  forExtension (extension: string) {
    return this.formats.find(format => format.extensions.includes(extension))
  }
}

export const formatRegistry = new FormatRegistry()

export function registerFormat (klass: { new (): Format }) {
  formatRegistry.add(new klass())
}
