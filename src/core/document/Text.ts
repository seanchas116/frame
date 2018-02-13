import { observable } from 'mobx'
import { HSVColor } from '../../lib/Color'

export interface TextSpan {
  readonly family?: string
  readonly size: number
  readonly weight: number
  readonly color: HSVColor
  readonly content: string
}

export const defaultTextSpan: TextSpan = {
  size: 12,
  weight: 300,
  color: HSVColor.black,
  content: ''
}

export class Text {
  readonly spans = observable<TextSpan>([])

  get isEmpty () {
    return this.spans.length === 0
  }
}
