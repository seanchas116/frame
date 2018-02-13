import { Document } from '../Document'
import { Layer } from '../Layer'
import { RectShape } from '../Shape'
import { Rect } from 'paintvec'
import { defaultTextSpan } from '../Text'

export function createShapeLayer (document: Document) {
  const layer = new Layer()
  layer.shape = new RectShape()
  layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
  layer.name = 'Layer'
  layer.text.spans.replace([{
    ...defaultTextSpan,
    content: 'Text'
  }])
  return layer
}

export function createGroupLayer (document: Document, children: Layer[]) {
  const layer = new Layer()
  layer.name = 'Group'
  layer.children.replace(children)
  return layer
}

export function createDocument () {
  const document = new Document()
  document.rootGroup.children.replace([
    createShapeLayer(document),
    createShapeLayer(document),
    createGroupLayer(document, [
      createShapeLayer(document),
      createShapeLayer(document)
    ]),
    createShapeLayer(document)
  ])
  return document
}
