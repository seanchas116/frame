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

export interface LinearGradientBrushData {
  type: 'linearGradient'
  begin: Vec2Data
  end: Vec2Data
  stops: [number, HSVColorData][]
}

export type BrushData = ColorBrushData | LinearGradientBrushData

export interface RectShapeData {
  type: 'rect'
  rect: RectData
  radius: number
}

export interface EllipseShapeData {
  type: 'ellipse'
  rect: RectData
}

export interface TextShapeData {
  type: 'text'
  rect: RectData
  text: string
}

export interface ImageShapeData {
  type: 'image'
  rect: RectData
  dataURL: string
}

export type ShapeData = RectShapeData | EllipseShapeData | TextShapeData | ImageShapeData
