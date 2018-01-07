import * as React from 'react'
import { action } from 'mobx'
import { TextSpan } from '../../core/document/Text'
import { Layer } from '../../core/document/Layer'
const styles = require('./TextEditor.css')

export class TextEdior extends React.Component<{layer: Layer}> {
  element: HTMLDivElement

  componentDidMount () {
    const { text } = this.props.layer
    for (const fragment of text.fragments) {
      if (fragment.type === 'span') {
        const spanElem = document.createElement('span')
        spanElem.innerText = fragment.characters.join('')
        this.element.appendChild(spanElem)
      } else {
        this.element.appendChild(document.createElement('br'))
      }
    }
  }

  render () {
    const { left, top, width, height } = this.props.layer.rect
    const style = {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    }
    return <div
      ref={e => this.element = e!}
      className={styles.TextEditor} style={style}
      onInput={this.handleInput}
      onKeyPress={this.handleKeyPress}
      contentEditable={true}
    />
  }

  @action private handleInput = () => {
    const span: TextSpan = {
      type: 'span',
      characters: [...this.element.innerText]
    }
    this.props.layer.text.fragments.replace([span])
  }

  @action private handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      document.execCommand('insertHTML', false, '<br><br>')
      e.preventDefault()
    }
  }
}
