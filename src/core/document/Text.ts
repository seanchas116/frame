import { observable, computed } from 'mobx'
import { HSVColor } from '../../lib/Color'
import { sameOrNone } from '../../lib/sameOrNone'
import { ValueRange } from '../../lib/ValueRange'

export interface TextStyle {
  readonly family: string
  readonly size: number
  readonly weight: number
  readonly color: HSVColor
}

export const TextStyle = {
  default: {
    family: 'Helvetica Neue', // FIXME: Helvetica Neue is probably not available in Windows
    size: 12,
    weight: 300,
    color: HSVColor.black
  },
  combine (styles: TextStyle[]): Partial<TextStyle> {
    return {
      family: sameOrNone(styles.map(s => s.family)),
      size: sameOrNone(styles.map(s => s.size)),
      weight: sameOrNone(styles.map(s => s.weight)),
      color: sameOrNone(styles.map(s => s.color), (c1, c2) => c1.equals(c2))
    }
  },
  equals (a: TextStyle, b: TextStyle) {
    return a.family === b.family && a.size === b.size && a.weight === b.weight && a.color.equals(b.color)
  }
}

export interface TextSpan extends TextStyle {
  readonly content: string
}

export const TextSpan = {
  slice (span: TextSpan, range: ValueRange) {
    return {
      ...span,
      content: span.content.slice(range.begin, range.end)
    }
  },
  shrink (spans: TextSpan[]) {
    const newSpans: TextSpan[] = []
    let mergingSpan: TextSpan | undefined = undefined
    for (const span of spans) {
      if (mergingSpan) {
        if (TextStyle.equals(mergingSpan, span)) {
          // ↓TypeScript bug?
          const content: any = mergingSpan.content + span.content
          mergingSpan = { ...(mergingSpan as TextSpan), content }
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

  setStyle (range: ValueRange, style: Partial<TextStyle>) {
    const leftRange = new ValueRange(-Infinity, range.begin)
    const rightRange = new ValueRange(range.end, Infinity)
    let newSpans: TextSpan[] = []
    let offset = 0
    for (const span of this.spans) {
      const spanRange = new ValueRange(offset, offset + span.content.length)
      const leftOverlap = spanRange.intersection(leftRange)
      const overlap = spanRange.intersection(range)
      const rightOverlap = spanRange.intersection(rightRange)
      if (leftOverlap && leftOverlap.length > 0) {
        newSpans.push(TextSpan.slice(span, leftOverlap.shift(-spanRange.begin)))
      }
      if (overlap && overlap.length > 0) {
        const newSpan = { ...TextSpan.slice(span, overlap.shift(-spanRange.begin)), ...style }
        newSpans.push(newSpan)
      }
      if (rightOverlap && rightOverlap.length > 0) {
        newSpans.push(TextSpan.slice(span, rightOverlap.shift(-spanRange.begin)))
      }
      offset = spanRange.end
    }
    this.spans.replace(newSpans)
  }

  getStyle (range: ValueRange) {
    if (range.length > 0) {
      let offset = 0
      const overlappingStyles: TextStyle[] = []
      for (const span of this.spans) {
        const spanRange = new ValueRange(offset, offset + span.content.length)
        const overlap = spanRange.intersection(range)
        if (overlap && overlap.length > 0) {
          overlappingStyles.push(span)
        }
        offset = spanRange.end
      }
      return TextStyle.combine(overlappingStyles)
    } else {
      // cursor with no selection
      let offset = 0
      for (const span of this.spans) {
        offset += span.content.length
        if (range.begin <= offset) {
          return span
        }
      }
      return {}
    }
  }

  shrink () {
    this.spans.replace(TextSpan.shrink(Array.from(this.spans)))
  }
}
