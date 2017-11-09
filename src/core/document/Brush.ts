import { observable } from 'mobx'

export class ColorBrush {
  @observable color: Color
}

export type GradientStop = [number, Color]

export class LinearGradientBrush {
  @observable begin = new Point()
  @observable end = new Point()
  readonly stops = observable<GradientStop>()
}

export type Brush = ColorBrush | LinearGradientBrush
