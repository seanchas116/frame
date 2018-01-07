import * as React from 'react'
import { action } from 'mobx'
import { Layer } from '../../core/document/Layer'
const styles = require('./TextEditor.css')

export class TextEdior extends React.Component<{layer: Layer}> {
  element: HTMLDivElement

  render () {
    const { left, top, width, height } = this.props.layer.rect
    const style = {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    }
    return <div ref={e => this.element = e!} className={styles.TextEditor} style={style} onInput={this.handleInput} contentEditable={true}>Test</div>
  }

  @action private handleInput = () => {
    console.log(this.element.innerText)
  }
}
