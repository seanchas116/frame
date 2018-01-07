import * as React from 'react'
import { action } from 'mobx'
import { TextSpan } from '../../core/document/Text'
import { Layer } from '../../core/document/Layer'
const styles = require('./TextEditor.css')

export class TextEdior extends React.Component<{layer: Layer}> {
  element: HTMLDivElement

  componentDidMount () {
    const { text } = this.props.layer
    for (const span of text.spans) {
      const spanElem = document.createElement('span')
      spanElem.innerText = span.characters.join('')
      this.element.appendChild(spanElem)
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
    return <div ref={e => this.element = e!} className={styles.TextEditor} style={style} onInput={this.handleInput} contentEditable={true} />
  }

  @action private handleInput = () => {
    const span: TextSpan = {
      characters: [...this.element.innerText]
    }
    this.props.layer.text.spans.replace([span])
  }
}
