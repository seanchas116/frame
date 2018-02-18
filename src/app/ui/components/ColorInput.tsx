import * as React from 'react'
import { HSVColor, RGBColor } from '../../../lib/Color'

interface ColorInputProps {
  className?: string
  value: HSVColor
  onChange: (value: HSVColor) => void
  onChangeEnd: () => void
}

export class ColorInput extends React.Component<ColorInputProps> {
  render () {
    const { value, className, onChangeEnd } = this.props
    const color = value.toRGB().toHexRGBString()
    return <input className={className} type='color' value={color} onChange={this.handleChange} onBlur={onChangeEnd}/>
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = RGBColor.fromString(e.currentTarget.value).toHSV()
    this.props.onChange(color)
  }
}
