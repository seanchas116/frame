import { Vec2, Rect } from 'paintvec'
import { Document } from '../../document/Document'
import { DocumentData, BrushData, HSVColorData, Vec2Data, ShapeData, RectData, LayerData, StyleData } from './Schema'
import { Brush, ColorBrush, LinearGradientBrush, GradientStop } from '../../document/Brush'
import { Shape, RectShape, EllipseShape, TextShape, ImageShape } from '../../document/Shape'
import { HSVColor } from '../../common/Color'
import { Style } from '../../document/Style'
import { Layer, ShapeLayer, GroupLayer } from '../../document/Layer'

export function dataToVec2 (p: Vec2Data) {
  return new Vec2(p.x, p.y)
}

export function dataToRect (r: RectData) {
  return Rect.fromWidthHeight(r.x, r.y, r.w, r.h)
}

export function dataToHSV (data: HSVColorData) {
  return new HSVColor(data.h, data.s, data.v, data.a)
}

export function dataToBrush (data: BrushData): Brush {
  switch (data.type) {
    case 'color':
      return new ColorBrush(dataToHSV(data.color))
    case 'linearGradient': {
      const brush = new LinearGradientBrush()
      brush.begin = dataToVec2(data.begin)
      brush.end = dataToVec2(data.end)
      brush.stops.replace(brush.stops.map(([pos, color]): GradientStop => [pos, dataToHSV(color)]))
      return brush
    }
  }
}

export async function dataToShape (data: ShapeData): Promise<Shape> {
  switch (data.type) {
    case 'text': {
      const shape = new TextShape()
      shape.text = data.text
      return shape
    }
    case 'image': {
      const shape = new ImageShape()
      await shape.loadDataURL(shape.dataURL)
      return shape
    }
    case 'rect': {
      const shape = new RectShape()
      shape.radius = data.radius
      return shape
    }
    case 'ellipse': {
      return new EllipseShape()
    }
  }
}

export function dataToStyle (data: StyleData): Style {
  const style = new Style()
  style.fillEnabled = data.fillEnabled
  style.fill = dataToBrush(data.fill)
  style.strokeEnabled = data.strokeEnabled
  style.stroke = dataToBrush(data.stroke)
  style.strokeWidth = data.strokeWidth
  style.strokeAlignment = data.strokeAlignment
  return style
}

export async function dataToLayer (data: LayerData): Promise<Layer> {
  switch (data.type) {
    case 'shape': {
      const layer = new ShapeLayer()
      layer.name = data.name
      layer.rect = dataToRect(data.rect)
      layer.shape = await dataToShape(data.shape)
      layer.style = dataToStyle(data.style)
      return layer
    }
    case 'group': {
      const layer = new GroupLayer()
      layer.name = data.name
      layer.children.replace(await Promise.all(data.children.map(dataToLayer)))
      return layer
    }
  }
}

export async function dataToDocument (data: DocumentData): Promise<Document> {
  const document = new Document()
  document.rootGroup.children.replace(await Promise.all(data.layers.map(dataToLayer)))
  return document
}
