export class ValueRange {
  constructor (public begin: number, public end: number) {
  }

  get length () {
    return this.end - this.begin
  }

  union (other: ValueRange) {
    const begin = Math.min(this.begin, other.begin)
    const end = Math.max(this.end, other.end)
    return new ValueRange(begin, end)
  }

  intersection (other: ValueRange) {
    const begin = Math.max(this.begin, other.begin)
    const end = Math.min(this.end, other.end)
    if (begin <= end) {
      return new ValueRange(begin, end)
    }
  }

  static fromValues (...values: number[]) {
    const begin = Math.min(...values)
    const end = Math.max(...values)
    return new ValueRange(begin, end)
  }
}
