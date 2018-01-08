import * as React from 'react'
import * as styles from './ClickToEdit.scss'

interface ClickToEditProps {
  text: string
  onChange: (text: string) => void
  editable: boolean
}

interface ClickToEditState {
  isEditing: boolean
}

export class ClickToEdit extends React.Component<ClickToEditProps, ClickToEditState> {
  state = {
    isEditing: false
  }

  private inputElement: HTMLInputElement

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
    return (
      <div className={styles.ClickToEdit}>
        <div style={{ visibility: isEditing ? 'hidden' : 'visible' }} className={styles.ClickToEditText} onClick={this.handleTextClick}>{text}</div>
        <input ref={e => this.inputElement = e!} type='text' hidden={!isEditing} className={styles.ClickToEditInput} defaultValue={text}
          onBlur={this.handleInputBlur}
          onKeyPress={this.handleInputKeyPress}
        />
      </div>
    )
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
