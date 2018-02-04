import { Vec2, Rect } from 'paintvec'
import { Document } from '../../document/Document'
import { DocumentData, BrushData, HSVColorData, Vec2Data, ShapeData, RectData, LayerData, StyleData, DeepLayerData, TextData, TextFragmentData } from './Schema'
import { Brush, ColorBrush, LinearGradientBrush, GradientStop } from '../../document/Brush'
import { Shape, RectShape, EllipseShape, TextShape, ImageShape, GroupShape } from '../../document/Shape'
import { HSVColor } from '../../../lib/Color'
import { Style } from '../../document/Style'
import { Layer } from '../../document/Layer'
import { Text, TextFragment } from '../../document/Text'

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

export function dataToShape (data: ShapeData): Shape {
  switch (data.type) {
    case 'text': {
      const shape = new TextShape()
      shape.text = data.text
      return shape
    }
    case 'image': {
      const shape = new ImageShape()
      shape.dataURL = data.dataURL
      shape.originalSize = dataToVec2(data.originalSize)
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
    case 'group': {
      return new GroupShape()
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

export function dataToTextFragment (data: TextFragmentData): TextFragment {
  if (data.type === 'span') {
    return {
      type: 'span',
      characters: [...data.content]
    }
  } else {
    return {
      type: 'break'
    }
  }
}

export function dataToText (data: TextData): Text {
  const text = new Text()
  text.fragments.replace(data.fragments.map(dataToTextFragment))
  return text
}

export function loadLayerData (layer: Layer, data: LayerData) {
  layer.name = data.name
  layer.rect = dataToRect(data.rect)
  layer.shape = dataToShape(data.shape)
  layer.style = dataToStyle(data.style)
  layer.text = dataToText(data.text)
}

export function dataToLayer (data: LayerData): Layer {
  const layer = new Layer()
  loadLayerData(layer, data)
  return layer
}

export function dataToLayerDeep (data: DeepLayerData): Layer {
  const layer = dataToLayer(data)
  layer.children.replace(data.children.map(dataToLayerDeep))
  return layer
}

export function dataToDocument (data: DocumentData): Document {
  const document = new Document()
  document.rootGroup.children.replace(data.layers.map(dataToLayerDeep))
  return document
}
