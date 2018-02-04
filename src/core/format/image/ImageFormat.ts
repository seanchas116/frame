import { Format } from '../Format'
import { Document } from '../../document/Document'
import { Rect } from 'paintvec'
import { ImageShape } from '../../document/Shape'
import { Layer } from '../../document/Layer'

export abstract class ImageFormat implements Format {
  abstract readonly extensions: ReadonlyArray<string>
  abstract readonly mime: string
  abstract readonly uti: string
  readonly isLayered = false

  async serialize (document: Document): Promise<Buffer> {
    throw new Error('TODO')
  }

  async deserialize (buffer: Buffer): Promise<Document> {
    const dataURL = `data:${this.mime};base64,${buffer.toString('base64')}`
    const layer = new Layer()
    const shape = new ImageShape()
    await shape.loadDataURL(dataURL)
    layer.shape = shape
    layer.rect = Rect.fromWidthHeight(0, 0, shape.originalSize.width, shape.originalSize.height)
    layer.name = 'Image'

    const document = new Document()
    document.rootGroup.children.replace([layer])
    return document
  }
}
