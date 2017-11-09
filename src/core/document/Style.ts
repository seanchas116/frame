import { observable } from 'mobx'
import { Brush } from './Brush'

export type StrokeAlignment = 'center' | 'inner' | 'outer'

export class Style {
  @observable hasFill = true
  @observable fill: Brush
  @observable hasStroke = true
  @observable stroke: Brush
  @observable strokeWidth = 1
  @observable strokeAlignment: StrokeAlignment
}
