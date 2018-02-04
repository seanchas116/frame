import * as path from 'path'
import { Format, formatRegistry } from './Format'
import { Document } from '../document/Document'

export class FormatFileLoader {
  constructor (public format: Format) {
  }

  async loadBlob (blob: Blob) {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const data = reader.result
        resolve(new Buffer(data))
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    })
    return this.format.deserialize(buffer)
  }

  static forExtension (ext: string): FormatFileLoader | undefined {
    const format = formatRegistry.forExtension(ext)
    if (format) {
      return new FormatFileLoader(format)
    }
  }

  static async loadFile (file: File): Promise<Document | undefined> {
    const ext = path.extname(file.name).slice(1)
    const loader = this.forExtension(ext)
    if (loader) {
      return loader.loadBlob(file)
    }
  }
}
