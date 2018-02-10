import * as React from 'react'
import { action } from 'mobx'
import { Document } from '../../core/document/Document'
import { Layer } from '../../core/document/Layer'
import { TextEdior } from './TextEditor'
import { Overlay } from './components/Overlay'

export class TextEditorOverlay extends React.Component<{layer: Layer}> {
  render () {
    return <Overlay>
      <Overlay onClick={this.handleClickBackground} />
      <TextEdior layer={this.props.layer} />
    </Overlay>
  }

  @action private handleClickBackground = () => {
    Document.current.focusedLayer = undefined
  }
}
