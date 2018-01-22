import { Vec2, Rect } from 'paintvec'
import { Document } from '../../document/Document'
import { DocumentData, BrushData, HSVColorData, Vec2Data, GradientStopData, ShapeData, RectData, LayerData, DeepLayerData, TextFragmentData } from './Schema'
import { Brush, ColorBrush } from '../../document/Brush'
import { Shape, RectShape, EllipseShape, TextShape, ImageShape, GroupShape } from '../../document/Shape'
import { HSVColor } from '../../../lib/Color'
import { Style } from '../../document/Style'
import { Layer } from '../../document/Layer'
import { TextFragment, Text } from '../../document/Text'

export function vec2ToData (p: Vec2): Vec2Data {
  const { x, y } = p
  return { x, y }
}

export function rectToData (r: Rect): RectData {
  const { left: x, top: y, width: w, height: h } = r
  return { x, y, w, h }
}

export function hsvToData (color: HSVColor): HSVColorData {
  const { h, s, v, a } = color
  return { h, s, v, a }
}

export function brushToData (brush: Brush): BrushData {
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

export function shapeToData (shape: Shape): ShapeData {
  if (shape instanceof TextShape) {
    return {
      type: 'text',
      text: shape.text
    }
  } else if (shape instanceof ImageShape) {
    return {
      type: 'image',
      dataURL: shape.dataURL,
      originalSize: vec2ToData(shape.originalSize)
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
  } else if (shape instanceof GroupShape) {
    return {
      type: 'group'
    }
  }
  throw new Error(`Unknown shape: ${(shape as Object).constructor.name}`)
}

export function styleToData (style: Style) {
  return {
    fillEnabled: style.fillEnabled,
    fill: brushToData(style.fill),
    strokeEnabled: style.strokeEnabled,
    stroke: brushToData(style.stroke),
    strokeWidth: style.strokeWidth,
    strokeAlignment: style.strokeAlignment
  }
}

export function textFragmentToData (fragment: TextFragment): TextFragmentData {
  if (fragment.type === 'span') {
    return {
      type: 'span',
      content: fragment.characters.join('')
    }
  } else {
    return {
      type: 'break'
    }
  }
}

export function textToData (text: Text) {
  return {
    fragments: text.fragments.map(textFragmentToData)
  }
}

export function layerToData (layer: Layer): LayerData {
  return {
    name: layer.name,
    rect: rectToData(layer.rect),
    shape: shapeToData(layer.shape),
    style: styleToData(layer.style),
    text: textToData(layer.text)
  }
}

export function layerToDataDeep (layer: Layer): DeepLayerData {
  return {
    ...layerToData(layer),
    children: layer.children.map(layerToDataDeep)
  }
}

export function documentToData (document: Document): DocumentData {
  return {
    layers: document.rootGroup.children.map(layerToDataDeep)
  }
}