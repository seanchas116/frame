import { observable, computed } from 'mobx'
import { HSVColor } from '../../lib/Color'
import { sameOrNone } from '../../lib/sameOrNone'
import { ValueRange } from '../../lib/ValueRange'

export class TextStyle {
  constructor (
    public readonly family: string,
    public readonly size: number,
    public readonly weight: number,
    public readonly color: HSVColor
  ) {}

  static default = new TextStyle(
    'Helvetica Neue', // FIXME: Helvetica Neue is probably not available in Windows
    12,
    300,
    HSVColor.black
  )

  static combine (styles: TextStyle[]): Partial<TextStyle> {
    return {
      family: sameOrNone(styles.map(s => s.family)),
      size: sameOrNone(styles.map(s => s.size)),
      weight: sameOrNone(styles.map(s => s.weight)),
      color: sameOrNone(styles.map(s => s.color), (c1, c2) => c1.equals(c2))
    }
  }

  equals (other: TextStyle) {
    return this.family === other.family && this.size === other.size && this.weight === other.weight && this.color.equals(other.color)
  }

  clone () {
    return new TextStyle(this.family, this.size, this.weight, this.color)
  }

  assign (partialStyle: Partial<TextStyle>) {
    return Object.assign(this.clone(), partialStyle)
  }
}

export class TextSpan {
  constructor (
    public readonly content: string,
    public readonly style: TextStyle
  ) {}

  slice (range: ValueRange) {
    return new TextSpan(
      this.content.slice(range.begin, range.end),
      this.style
    )
  }

  static shrink (spans: TextSpan[]) {
    const newSpans: TextSpan[] = []
    let mergingSpan: TextSpan | undefined = undefined
    for (const span of spans) {
      if (mergingSpan) {
        if (mergingSpan.style.equals(span.style)) {
          // ↓TypeScript bug?
          const content: any = mergingSpan.content + span.content
          mergingSpan = new TextSpan(content, mergingSpan.style)
        } else {
          newSpans.push(mergingSpan)
          mergingSpan = span
        }
      } else {
        mergingSpan = span
      }
    }
    if (mergingSpan) {
      newSpans.push(mergingSpan)
    }
    return newSpans
  }
}

export class Text {
  readonly spans = observable<TextSpan>([])

  @computed get isEmpty () {
    return this.spans.length === 0
  }

  @computed get spansWithRange (): ReadonlyArray<[TextSpan, ValueRange]> {
    let pairs: [TextSpan, ValueRange][] = []
    let lastEnd = 0
    for (const span of this.spans) {
      let begin = lastEnd
      let end = begin + span.content.length
      lastEnd = end
      pairs.push([span, new ValueRange(begin, end)])
    }
    return pairs
  }

  spansInRange (range: ValueRange) {
    const spansInRange: TextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange) {
      const overlap = spanRange.intersection(range)
      if (overlap && overlap.length > 0) {
        spansInRange.push(span)
      }
    }
    return spansInRange
  }

  setStyle (range: ValueRange, style: Partial<TextStyle>) {
    const leftRange = new ValueRange(-Infinity, range.begin)
    const rightRange = new ValueRange(range.end, Infinity)
    let newSpans: TextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange) {
      const leftOverlap = spanRange.intersection(leftRange)
      const overlap = spanRange.intersection(range)
      const rightOverlap = spanRange.intersection(rightRange)
      if (leftOverlap && leftOverlap.length > 0) {
        newSpans.push(span.slice(leftOverlap.shift(-spanRange.begin)))
      }
      if (overlap && overlap.length > 0) {
        const slicedSpan = span.slice(overlap.shift(-spanRange.begin))
        const newSpan = new TextSpan(slicedSpan.content, slicedSpan.style.assign(style))
        newSpans.push(newSpan)
      }
      if (rightOverlap && rightOverlap.length > 0) {
        newSpans.push(span.slice(rightOverlap.shift(-spanRange.begin)))
      }
    }
    this.spans.replace(newSpans)
  }

  shrink () {
    this.spans.replace(TextSpan.shrink(Array.from(this.spans)))
  }
}
