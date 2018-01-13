import * as React from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  // onChangeEnd: () => void
}

interface NumberInputState {
  value: number
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
  private isTyping = false

  constructor (props: NumberInputProps) {
    super(props)
    this.state = { value: props.value }
  }

  componentWillReceiveProps (nextProps: NumberInputProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  render () {
    return <input
      type='number' value={this.state.value}
      onKeyDown={this.handleKeyDown}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
    />
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.isTyping = true
    if (e.key === 'Enter') {
      this.props.onChange(this.state.value)
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value)
    this.setState({ value })
    if (this.isTyping) {
      this.isTyping = false
    } else {
      this.props.onChange(value)
    }
  }

  private handleBlur = () => {
    this.props.onChange(this.state.value)
  }
}
