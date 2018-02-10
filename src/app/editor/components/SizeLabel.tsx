import * as React from 'react'
import { Rect } from 'paintvec'

export const SizeLabel = (props: {rect: Rect}) => {
  const { rect } = props
  const { width, height, left, top, right, bottom } = rect
  const style = { fontSize: '12px' }

  const widthLabel = <text
    textAnchor='middle'
    x={(left + right) / 2} y={bottom + 16}
    fill='blue' style={style}>
    {width}
  </text>
  const heightLabel = <text
    x={right + 8} y={(top + bottom) / 2}
    fill='blue' style={style}>
    {height}
  </text>
  return <g>{widthLabel}{heightLabel}</g>
}
