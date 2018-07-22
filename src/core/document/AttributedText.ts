import { observable, computed } from 'mobx'
import { HSVColor } from '../../lib/Color'
import { sameOrNone } from '../../lib/sameOrNone'
import { ValueRange } from '../../lib/ValueRange'

export class AttributedTextStyle {
  constructor (
    public readonly family: string,
    public readonly size: number,
    public readonly weight: number,
    public readonly color: HSVColor
  ) {}

  static default = new AttributedTextStyle(
    'Helvetica Neue', // FIXME: Helvetica Neue is probably not available in Windows
    12,
    300,
    HSVColor.black
  )

  static combine (styles: Partial<AttributedTextStyle>[]): Partial<AttributedTextStyle> {
    return {
      family: sameOrNone(styles.map(s => s.family)),
      size: sameOrNone(styles.map(s => s.size)),
      weight: sameOrNone(styles.map(s => s.weight)),
      color: sameOrNone(styles.map(s => s.color), (c1, c2) => c1 != null && c2 != null && c1.equals(c2))
    }
  }

  equals (other: AttributedTextStyle) {
    return this.family === other.family && this.size === other.size && this.weight === other.weight && this.color.equals(other.color)
  }

  clone () {
    return new AttributedTextStyle(this.family, this.size, this.weight, this.color)
  }

  assign (partialStyle: Partial<AttributedTextStyle>) {
    return Object.assign(this.clone(), partialStyle)
  }
}

export class AttributedTextSpan {
  constructor (
    public readonly content: string,
    public readonly style: AttributedTextStyle
  ) {}

  slice (range: ValueRange) {
    return new AttributedTextSpan(
      this.content.slice(range.begin, range.end),
      this.style
    )
  }

  static shrink (spans: AttributedTextSpan[]) {
    const newSpans: AttributedTextSpan[] = []
    let mergingSpan: AttributedTextSpan | undefined = undefined
    for (const span of spans) {
      if (mergingSpan) {
        if (mergingSpan.style.equals(span.style)) {
          // ↓TypeScript bug?
          const content: any = mergingSpan.content + span.content
          mergingSpan = new AttributedTextSpan(content, mergingSpan.style)
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

export class AttributedTextLine {
  readonly spans = observable<AttributedTextSpan>([])

  constructor (spans: AttributedTextSpan[]) {
    this.spans.replace(spans)
  }

  get characterCount () {
    let sum = 0
    for (const span of this.spans) {
      sum += span.content.length
    }
    return sum
  }

  @computed get isEmpty () {
    return this.spans.length === 0
  }

  @computed get spansWithRange (): ReadonlyArray<[AttributedTextSpan, ValueRange]> {
    let pairs: [AttributedTextSpan, ValueRange][] = []
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
    const spansInRange: AttributedTextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange) {
      const overlap = spanRange.intersection(range)
      if (overlap && overlap.length > 0) {
        spansInRange.push(span)
      }
    }
    return spansInRange
  }

  setStyle (range: ValueRange, style: Partial<AttributedTextStyle>) {
    const leftRange = new ValueRange(-Infinity, range.begin)
    const rightRange = new ValueRange(range.end, Infinity)
    let newSpans: AttributedTextSpan[] = []
    for (const [span, spanRange] of this.spansWithRange) {
      const leftOverlap = spanRange.intersection(leftRange)
      const overlap = spanRange.intersection(range)
      const rightOverlap = spanRange.intersection(rightRange)
      if (leftOverlap && leftOverlap.length > 0) {
        newSpans.push(span.slice(leftOverlap.shift(-spanRange.begin)))
      }
      if (overlap && overlap.length > 0) {
        const slicedSpan = span.slice(overlap.shift(-spanRange.begin))
        const newSpan = new AttributedTextSpan(slicedSpan.content, slicedSpan.style.assign(style))
        newSpans.push(newSpan)
      }
      if (rightOverlap && rightOverlap.length > 0) {
        newSpans.push(span.slice(rightOverlap.shift(-spanRange.begin)))
      }
    }
    this.spans.replace(newSpans)
  }

  getStyle (range: ValueRange) {
    let offset = 0
    const styles: AttributedTextStyle[] = []
    for (const span of this.spans) {
      const spanRange = new ValueRange(offset, offset + span.content.length)
      const overlap = spanRange.intersection(range)
      if (overlap) {
        styles.push(span.style)
      }
      offset = spanRange.end
    }
    return AttributedTextStyle.combine(styles)
  }

  shrink () {
    this.spans.replace(AttributedTextSpan.shrink(Array.from(this.spans)))
  }
}

export class AttributedText {
  readonly lines = observable<AttributedTextLine>([])

  constructor (lines: AttributedTextLine[]) {
    this.lines.replace(lines)
  }

  get isEmpty () {
    return this.lines.length === 0 || this.lines[0].spans.length === 0
  }

  setStyle (range: ValueRange, style: Partial<AttributedTextStyle>) {
    let offset = 0
    for (const line of this.lines) {
      line.setStyle(range.shift(-offset), style)
      offset += line.characterCount
      offset += 1
    }
  }

  getStyle (range: ValueRange) {
    let offset = 0
    const styles: Partial<AttributedTextStyle>[] = []
    for (const line of this.lines) {
      const lineRange = new ValueRange(offset, offset + line.characterCount)
      const overlap = lineRange.intersection(range)
      if (overlap && overlap.length > 0) {
        const style = line.getStyle(range.shift(-offset))
        console.log(style)
        styles.push(style)
      }
      offset = lineRange.end + 1
      // TODO set style correctly when linebreak is selected
    }
    return AttributedTextStyle.combine(styles)
  }

  shrink () {
    for (const line of this.lines) {
      line.shrink()
    }
  }
}
