import { Document } from '../Document'
import { Layer } from '../Layer'
import { RectShape, TextShape } from '../Shape'
import { Rect } from 'paintvec'
import { AttributedTextStyle, AttributedTextSpan } from '../AttributedText'

export function createShapeLayer (document: Document) {
  const layer = new Layer()
  layer.shape = new RectShape()
  layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
  layer.name = 'Layer'
  return layer
}

export function createTextLayer (document: Document) {
  const layer = new Layer()
  const shape = new TextShape()
  shape.text.spans.replace([
    new AttributedTextSpan('Text', AttributedTextStyle.default)
  ])
  layer.shape = shape
  layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
  layer.name = 'Layer'

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
    createTextLayer(document),
    createGroupLayer(document, [
      createTextLayer(document),
      createShapeLayer(document)
    ]),
    createShapeLayer(document)
  ])
  return document
}
