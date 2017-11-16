import { Vec2 } from 'paintvec'
import { Document } from '../../document/Document'
import { DocumentData, BrushData, HSVColorData, Vec2Data, GradientStopData } from './Schema'
import { Brush, ColorBrush } from '../../document/Brush'
import { HSVColor } from '../../common/Color'

function vec2ToData (p: Vec2): Vec2Data {
  const { x, y } = p
  return { x, y }
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

export class File {
  constructor (public readonly document: Document) {
  }

  toData (): DocumentData {
  }
}
