import { observable } from 'mobx'
import { Brush } from './Brush'

export type StrokeAlignment = 'center' | 'inner' | 'outer'

export class Style {
  @observable fillEnabled = true
  @observable fill: Brush
  @observable strokeEnabled = true
  @observable stroke: Brush
  @observable strokeWidth = 1
  @observable strokeAlignment: StrokeAlignment
}
