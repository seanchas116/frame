import { Transform } from 'paintvec'

export function toCSSTransform (transform: Transform) {
  const { m00, m01, m10, m11, m20, m21 } = transform
  return `matrix(${m00},${m01},${m10},${m11},${m20},${m21})`
}
