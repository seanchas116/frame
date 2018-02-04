import { Document } from '../document/Document'
import { observable } from 'mobx'
import { Format } from './Format'

export interface Format {
  /**
   * File extensions for the format
   */
  readonly extensions: ReadonlyArray<string>

  /**
   * MIME type for the format
   */
  readonly mime: string

  /**
   * macOS UTI for the format
   * https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html
   */
  readonly uti: string

  /**
   * Whether the format is loaded as multiple layers
   * False if the format represents non-layered image (PNG, JPG, ...)
   * True if the format can have multiple layers (PSD, SVG, ...)
   */
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
