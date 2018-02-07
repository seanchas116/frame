import * as React from 'react'
import styled from 'styled-components'

interface ClickToEditProps {
  text: string
  onChange: (text: string) => void
  editable: boolean
}

interface ClickToEditState {
  isEditing: boolean
}

const ClickToEditWrap = styled.div`
  --height: 16px;
  position: relative;
  height: var(--height);
  & > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    line-height: var(--height);
    font-size: 12px;
  }
`

interface ClickToEditTextProps {
  isEditing: boolean
}
const ClickToEditText = styled.div`
  visibility: ${(props: ClickToEditTextProps) => props.isEditing ? 'hidden' : 'visible'}
`

const ClickToEditInput = styled.input`
  border: none;
  outline: none;
`

export class ClickToEdit extends React.Component<ClickToEditProps, ClickToEditState> {
  state = {
    isEditing: false
  }

  private inputElement!: HTMLInputElement

  componentWillReceiveProps (props: ClickToEditProps) {
    if (!props.editable) {
      this.setState({
        isEditing: false
      })
    }
  }

  render () {
    const { text } = this.props
    const { isEditing } = this.state
    return <ClickToEditWrap>
      <ClickToEditText isEditing={isEditing} onClick={this.handleTextClick}>{text}</ClickToEditText>
      <ClickToEditInput innerRef={e => this.inputElement = e!} type='text' hidden={!isEditing} defaultValue={text}
        onBlur={this.handleInputBlur}
        onKeyPress={this.handleInputKeyPress}
      />
    </ClickToEditWrap>
  }

  private handleTextClick = () => {
    if (!this.props.editable) {
      return
    }
    this.setState({
      isEditing: true
    })
    this.inputElement.setSelectionRange(0, this.inputElement.value.length)
  }

  private handleEditFinish = (text: string) => {
    this.setState({
      isEditing: false
    })
    this.props.onChange(text)
  }

  private handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const text = this.inputElement.value
    this.handleEditFinish(text)
  }

  private handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const text = this.inputElement.value
      this.handleEditFinish(text)
      event.preventDefault()
    }
  }
}
