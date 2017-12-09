import * as React from 'react'
import { observer } from 'mobx-react'
import { Layer } from '../../core/document/Layer'

@observer export class LayerView extends React.Component<{layer: Layer}> {

  render () {
    const { layer } = this.props
    const shape = layer.shape.render(layer.rect)
    if (!shape) {
      return
    }
    const styled = React.cloneElement(shape as React.ReactSVGElement, {
      // TODO
    })
    return styled
  }
}
