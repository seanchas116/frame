export interface Vec2Data {
  x: number
  y: number
}

export interface RectData {
  x: number
  y: number
  w: number
  h: number
}

export interface HSVColorData {
  h: number
  s: number
  v: number
  a: number
}

export interface ColorBrushData {
  type: 'color'
  color: HSVColorData
}

export type GradientStopData = [number, HSVColorData]

export interface LinearGradientBrushData {
  type: 'linearGradient'
  begin: Vec2Data
  end: Vec2Data
  stops: GradientStopData[]
}

export type BrushData = ColorBrushData | LinearGradientBrushData

export interface RectShapeData {
  type: 'rect'
  radius: number
}

export interface EllipseShapeData {
  type: 'ellipse'
}

export interface TextShapeData {
  type: 'text'
  text: string
}

export interface ImageShapeData {
  type: 'image'
  dataURL: string
}

export type ShapeData = RectShapeData | EllipseShapeData | TextShapeData | ImageShapeData

export type StrokeAlignmentData = 'center' | 'inner' | 'outer'

export interface StyleData {
  fillEnabled: boolean
  fill: BrushData
  strokeEnabled: boolean
  stroke: BrushData
  strokeWidth: number
  strokeAlignment: StrokeAlignmentData
}

export interface ShapeLayerData {
  type: 'shape'
  name: string
  rect: RectData
  shape: ShapeData
  style: StyleData
}

export interface GroupLayerData {
  type: 'group'
  name: string
  children: LayerData[]
}

export type LayerData = ShapeLayerData | GroupLayerData

export interface DocumentData {
  layers: LayerData[]
}

export interface FileV1Data extends DocumentData {
  version: 1
}
