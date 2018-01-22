import { observable } from 'mobx'
import { Brush, ColorBrush } from './Brush'
import { HSVColor } from '../../lib/Color'

export type StrokeAlignment = 'center' | 'inner' | 'outer'

export class Style {
  @observable fillEnabled = true
  @observable fill: Brush = new ColorBrush(new HSVColor(0, 0, 1))
  @observable strokeEnabled = true
  @observable stroke: Brush = new ColorBrush(new HSVColor(0, 0, 0.5))
  @observable strokeWidth = 1
  @observable strokeAlignment: StrokeAlignment = 'center'
}
