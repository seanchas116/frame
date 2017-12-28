import { Document } from '../Document'
import { Layer } from '../Layer'
import { RectShape } from '../Shape'
import { Rect } from 'paintvec'

export function createShapeLayer (document: Document) {
  const layer = document.createLayer()
  layer.shape = new RectShape()
  layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
  layer.name = 'Layer'
  return layer
}

export function createGroupLayer (document: Document, children: Layer[]) {
  const layer = document.createLayer()
  layer.name = 'Group'
  layer.children.replace(children)
  return layer
}

export function createDocument () {
  const document = new Document()
  document.rootGroup = createGroupLayer(document, [
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
