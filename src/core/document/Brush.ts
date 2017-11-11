import { observable } from 'mobx'
import { Vec2 } from 'paintvec'

export class ColorBrush {
  @observable color: Color
}

export type GradientStop = [number, Color]

export class LinearGradientBrush {
  @observable begin = new Vec2()
  @observable end = new Vec2()
  readonly stops = observable<GradientStop>()
}

export type Brush = ColorBrush | LinearGradientBrush
