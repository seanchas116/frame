import { observable } from 'mobx'
import { HSVColor } from '../../lib/Color'

export interface TextSpan {
  type: 'span'
  // readonly fontFamily?: string
  readonly fontSize?: number
  readonly fontWeight?: number
  readonly color?: HSVColor
  readonly characters: string[]
}

export interface TextBreak {
  type: 'break'
}

export type TextFragment = TextSpan | TextBreak

export class Text {
  readonly fragments = observable<TextFragment>([])

  get isEmpty () {
    return this.fragments.length === 0
  }
}
