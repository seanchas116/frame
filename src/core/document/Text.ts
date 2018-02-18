import { observable } from 'mobx'
import { HSVColor } from '../../lib/Color'
import { sameOrNone } from '../../lib/sameOrNone'
import { ValueRange } from '../../lib/ValueRange'

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

  spansWithRange (): [TextSpan, ValueRange][] {
    let pairs: [TextSpan, ValueRange][] = []
    let lastEnd = 0
    for (const span of this.spans) {
      let begin = lastEnd
      let end = begin + span.content.length
      pairs.push([span, new ValueRange(begin, end)])
    }
    return pairs
  }

  styleForRange (range: ValueRange): Partial<TextStyle> {
    const spansInRange: TextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange()) {
      const overlap = spanRange.intersection(range)
      if (overlap && overlap.length > 0) {
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

  setStyle (range: ValueRange, style: Partial<TextStyle>) {
    const leftRange = new ValueRange(-Infinity, range.begin)
    const rightRange = new ValueRange(range.end, Infinity)
    let newSpans: TextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange()) {
      const leftOverlap = spanRange.intersection(leftRange)
      const overlap = spanRange.intersection(range)
      const rightOverlap = spanRange.intersection(rightRange)
      if (leftOverlap && leftOverlap.length > 0) {
        // TODO: add span with original style
      }
      if (overlap && overlap.length > 0) {
        // TODO: add styled span
      }
      if (rightOverlap && rightOverlap.length > 0) {
        // TODO: add span with original style
      }
    }
    return newSpans
  }
}
