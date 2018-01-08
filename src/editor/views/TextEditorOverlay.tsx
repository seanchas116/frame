import * as React from 'react'
import { action } from 'mobx'
import { Layer } from '../../core/document/Layer'
import { TextEdior } from './TextEditor'
import * as styles from './TextEditorOverlay.css'

export class TextEditorOverlay extends React.Component<{layer: Layer}> {
  render () {
    return <div className={styles.TextEditorOverlay}>
      <div className={styles.TextEditorOverlayBackground} onClick={this.handleClickBackground} />
      <TextEdior layer={this.props.layer} />
    </div>
  }

  @action private handleClickBackground = () => {
    this.props.layer.document.focusedLayer = undefined
  }
}
