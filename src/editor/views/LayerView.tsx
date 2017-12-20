import * as React from 'react'
import { observer } from 'mobx-react'
import { Layer } from '../../core/document/Layer'
import { Brush, ColorBrush } from '../../core/document/Brush'
import { Movable } from './Movable'

function brushToCSS (brush: Brush) {
  if (brush instanceof ColorBrush) {
    return brush.color.toRGB().toString()
  } else {
    // TODO
    return 'black'
  }
}

@observer export class LayerView extends React.Component<{layer: Layer}> {

  render () {
    const { layer } = this.props
    const shape = layer.shape.render(layer.rect)
    if (!shape) {
      return
    }
    const style: React.SVGAttributes<SVGElement> = {
      fill: layer.style.fillEnabled ? brushToCSS(layer.style.fill) : 'none',
      stroke: layer.style.strokeEnabled ? brushToCSS(layer.style.stroke) : 'none',
      strokeWidth: layer.style.strokeWidth
    }
    const styledElem = React.cloneElement(shape as React.ReactSVGElement, style)
    return <Movable layer={this.props.layer}>
      {styledElem}
    </Movable>
  }
}
