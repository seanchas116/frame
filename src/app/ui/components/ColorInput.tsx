import * as React from 'react'
import styled from 'styled-components'
import { HSVColor, RGBColor } from '../../../lib/Color'

interface ColorInputProps {
  className?: string
  value: HSVColor
  onChange: (value: HSVColor) => void
  onChangeEnd: () => void
}

const Input = styled.input`
  appearance: none;
  outline: none;
  border: none;
  box-sizing: border-box;
  padding: 0;
  width: 32px;
  height: 24px;
  border: 2px solid var(--background-color);
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
  }
`

export class ColorInput extends React.Component<ColorInputProps> {
  render () {
    const { value, className, onChangeEnd } = this.props
    const color = value.toRGB().toHexRGBString()
    return <Input className={className} type='color' value={color} onChange={this.handleChange} onBlur={onChangeEnd}/>
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = RGBColor.fromString(e.currentTarget.value).toHSV()
    this.props.onChange(color)
  }
}
