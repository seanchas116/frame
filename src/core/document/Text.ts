import { observable } from 'mobx'
import { HSVColor } from '../common/Color'

export type TextSpan = Readonly<{
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  color?: HSVColor
  characters: string[]
}>

export class Text {
  readonly spans = observable<TextSpan>([])

  get isEmpty () {
    return this.spans.length === 0
  }

  toString () {
    return this.spans.map(span => span.characters.join('')).join('')
  }
}
