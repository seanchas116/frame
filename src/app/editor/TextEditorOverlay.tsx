import * as React from 'react'
import { action } from 'mobx'
import { Document } from '../../core/document/Document'
import { Layer } from '../../core/document/Layer'
import { TextShape } from '../../core/document/Shape'
import { TextEdior } from './TextEditor'
import { Overlay } from './components/Overlay'

export class TextEditorOverlay extends React.Component<{layer: Layer}> {
  render () {
    const shape = this.props.layer.shape
    return <Overlay>
      <Overlay onClick={this.handleClickBackground} />
      {shape instanceof TextShape && <TextEdior layer={this.props.layer} shape={shape} />}
    </Overlay>
  }

  @action private handleClickBackground = () => {
    Document.current.focusedLayer = undefined
  }
}
