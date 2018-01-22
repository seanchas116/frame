import * as React from 'react'
import { action } from 'mobx'
import { Layer } from '../document/Layer'
import { TextEdior } from './TextEditor'
import * as styles from './TextEditorOverlay.scss'

export class TextEditorOverlay extends React.Component<{layer: Layer}> {
  render () {
    return <div className={styles.TextEditorOverlay}>
      <div className={styles.background} onClick={this.handleClickBackground} />
      <TextEdior layer={this.props.layer} />
    </div>
  }

  @action private handleClickBackground = () => {
    this.props.layer.document.focusedLayer = undefined
  }
}