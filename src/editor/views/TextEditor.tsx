import * as React from 'react'
import { Layer } from '../../core/document/Layer'
const styles = require('./TextEditor.css')

export class TextEdior extends React.Component<{layer: Layer}> {
  render () {
    const { left, top, width, height } = this.props.layer.rect
    const style = {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    }
    return <div className={styles.TextEditor} style={style} contentEditable>Test</div>
  }
}
