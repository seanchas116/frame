import { Document } from '../../core/document/Document'
import { ShapeLayer, Layer, GroupLayer } from '../../core/document/Layer'
import { RectShape } from '../../core/document/Shape'
import { Rect } from 'paintvec'

export function createShapeLayer () {
  const shape = new RectShape()
  const layer = new ShapeLayer(shape)
  layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
  layer.name = 'Layer'
  return layer
}

export function createGroupLayer (children: Layer[]) {
  const layer = new GroupLayer()
  layer.name = 'Group'
  layer.children.replace(children)
  return layer
}

export function createDocument () {
  const document = new Document()
  document.rootGroup = createGroupLayer([
    createShapeLayer(),
    createShapeLayer(),
    createGroupLayer([
      createShapeLayer(),
      createShapeLayer()
    ]),
    createShapeLayer()
  ])
  return document
}
