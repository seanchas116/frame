import { observable } from 'mobx'
import { Vec2 } from 'paintvec'
import { HSVColor, RGBColor } from '../common/Color'

export class ColorBrush {
  @observable color: HSVColor
  constructor (color: HSVColor) {
    this.color = color
  }
  static fromString (str: string) {
    return new ColorBrush(RGBColor.fromString(str).toHSV())
  }
}

export type GradientStop = [number, HSVColor]

export class LinearGradientBrush {
  @observable begin = new Vec2()
  @observable end = new Vec2()
  readonly stops = observable<GradientStop>([])
}

export type Brush = ColorBrush | LinearGradientBrush
