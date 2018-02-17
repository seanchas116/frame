import { observable } from 'mobx'
import { HSVColor } from '../../lib/Color'
import { sameOrNone } from '../../lib/sameOrNone'

export interface TextRange {
  begin: number
  end: number
}

export interface TextStyle {
  readonly family?: string
  readonly size: number
  readonly weight: number
  readonly color: HSVColor
}

export interface TextSpan extends TextStyle {
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

  spansWithRange (): [TextSpan, TextRange][] {
    let pairs: [TextSpan, TextRange][] = []
    let lastEnd = 0
    for (const span of this.spans) {
      let begin = lastEnd
      let end = begin + span.content.length
      pairs.push([span, { begin, end }])
    }
    return pairs
  }

  styleForRange (range: TextRange): Partial<TextStyle> {
    const spansInRange: TextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange()) {
      if (range.begin < spanRange.end && spanRange.begin < range.end) {
        spansInRange.push(span)
      }
    }
    return {
      family: sameOrNone(spansInRange.map(s => s.family)),
      size: sameOrNone(spansInRange.map(s => s.size)),
      weight: sameOrNone(spansInRange.map(s => s.weight)),
      color: sameOrNone(spansInRange.map(s => s.color), (c1, c2) => c1.equals(c2))
    }
  }
}
