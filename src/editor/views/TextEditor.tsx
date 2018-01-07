import * as React from 'react'
import { Layer } from '../../core/document/Layer'

export class TextEdior extends React.Component<{layer: Layer}> {
  render () {
    const { left, top, width, height } = this.props.layer.rect
    return <foreignObject x={left} y={top} width={width} height={height}>
      <div contentEditable>Test</div>
    </foreignObject>
  }
}
