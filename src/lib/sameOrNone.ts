
export function sameOrNone<T> (values: T[], compare?: (x: T, y: T) => boolean): T | undefined {
  if (!compare) {
    compare = (x, y) => x === y
  }
  if (values.length === 0) {
    return undefined
  }
  const first = values[0]
  for (const value of values) {
    if (!compare(value, first)) {
      return undefined
    }
  }
  return first
}
