import { Document } from '../Document'
import { ShapeLayer, Layer, GroupLayer } from '../Layer'
import { RectShape } from '../Shape'
import { Rect } from 'paintvec'

export function createShapeLayer () {
  const layer = new ShapeLayer()
  layer.shape = new RectShape()
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
