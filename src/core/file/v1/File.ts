import { Vec2, Rect } from 'paintvec'
import { Document } from '../../document/Document'
import { DocumentData, BrushData, HSVColorData, Vec2Data, GradientStopData, ShapeData, RectData, GroupLayerData, LayerData } from './Schema'
import { Brush, ColorBrush } from '../../document/Brush'
import { Shape, RectShape, EllipseShape, TextShape, ImageShape } from '../../document/Shape'
import { HSVColor } from '../../common/Color'
import { Style } from '../../document/Style'
import { Layer, ShapeLayer } from '../../document/Layer'

function vec2ToData (p: Vec2): Vec2Data {
  const { x, y } = p
  return { x, y }
}

function rectToData (r: Rect): RectData {
  const { left: x, top: y, width: w, height: h } = r
  return { x, y, w, h }
}

function hsvToData (color: HSVColor): HSVColorData {
  const { h, s, v, a } = color
  return { h, s, v, a }
}

function brushToData (brush: Brush): BrushData {
  if (brush instanceof ColorBrush) {
    return {
      type: 'color',
      color: hsvToData(brush.color)
    }
  } else {
    return {
      type: 'linearGradient',
      begin: vec2ToData(brush.begin),
      end: vec2ToData(brush.end),
      stops: brush.stops.map(([pos, color]): GradientStopData => [pos, hsvToData(color)])
    }
  }
}

function shapeToData (shape: Shape): ShapeData {
  if (shape instanceof TextShape) {
    return {
      type: 'text',
      text: shape.text
    }
  } else if (shape instanceof ImageShape) {
    return {
      type: 'image',
      dataURL: shape.dataURL
    }
  } else if (shape instanceof RectShape) {
    return {
      type: 'rect',
      radius: shape.radius
    }
  } else if (shape instanceof EllipseShape) {
    return {
      type: 'ellipse'
    }
  }
  throw new Error(`Unknown shape: ${(shape as Object).constructor.name}`)
}

function styleToData (style: Style) {
  return {
    fillEnabled: style.fillEnabled,
    fill: brushToData(style.fill),
    strokeEnabled: style.strokeEnabled,
    stroke: brushToData(style.stroke),
    strokeWidth: style.strokeWidth,
    strokeAlignment: style.strokeAlignment
  }
}

function layerToData (layer: Layer): LayerData {
  if (layer instanceof ShapeLayer) {
    return {
      type: 'shape',
      name: layer.name,
      rect: rectToData(layer.rect),
      shape: shapeToData(layer.shape),
      style: styleToData(layer.style)
    }
  } else {
    return {
      type: 'group',
      name: layer.name,
      children: layer.children.map(layerToData)
    }
  }
}

function documentToData (document: Document): DocumentData {
  return {
    rootGroup: layerToData(document.rootGroup) as GroupLayerData
  }
}

export class File {
  readonly document: Document

  constructor (data?: DocumentData) {
    if (data) {
      this.document = dataToDocument(data)
    } else {
      this.document = new Document()
    }
  }

  toData (): DocumentData {
    return documentToData(this.document)
  }
}
