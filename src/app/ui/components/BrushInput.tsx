import * as React from 'react'
import { HSVColor } from '../../../lib/Color'
import { Brush, ColorBrush } from '../../../core/document/Brush'
import { ColorInput } from './ColorInput'

interface BrushInputProps {
  className?: string
  value: Brush
  onChange: (value: Brush) => void
  onChangeEnd: () => void
}

export class BrushInput extends React.Component<BrushInputProps> {
  render () {
    const { value, className, onChangeEnd } = this.props
    const color = value instanceof ColorBrush ? value.color : HSVColor.black
    return <ColorInput className={className} value={color} onChange={this.handleChange} onChangeEnd={onChangeEnd} />
  }

  private handleChange = (color: HSVColor) => {
    const brush = new ColorBrush(color)
    this.props.onChange(brush)
  }
}
