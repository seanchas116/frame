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
  originalSize: Vec2Data
}

export interface GroupShapeData {
  type: 'group'
}

export type ShapeData = RectShapeData | EllipseShapeData | TextShapeData | ImageShapeData | GroupShapeData

export type StrokeAlignmentData = 'center' | 'inner' | 'outer'

export interface StyleData {
  fillEnabled: boolean
  fill: BrushData
  strokeEnabled: boolean
  stroke: BrushData
  strokeWidth: number
  strokeAlignment: StrokeAlignmentData
}

export interface TextSpanData {
  type: 'span'
  content: string
}

export interface TextBreakData {
  type: 'break'
}

export type TextFragmentData = TextSpanData | TextBreakData

export interface TextData {
  fragments: TextFragmentData[]
}

export interface LayerData {
  name: string
  rect: RectData
  shape: ShapeData
  style: StyleData
  text: TextData
}

export interface DeepLayerData extends LayerData {
  children: DeepLayerData[]
}

export interface DocumentData {
  layers: DeepLayerData[]
}

export interface FileV1Format extends DocumentData {
  version: 1
}
