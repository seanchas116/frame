import { observable } from 'mobx'
import { HSVColor } from '../../lib/Color'

export interface TextSpan {
  readonly fontFamily?: string
  readonly fontSize?: number
  readonly fontWeight?: number
  readonly color?: HSVColor
  readonly content: string
}

export class Text {
  readonly spans = observable<TextSpan>([])

  get isEmpty () {
    return this.spans.length === 0
  }
}
