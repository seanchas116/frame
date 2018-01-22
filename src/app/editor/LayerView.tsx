import * as React from 'react'
import { observer } from 'mobx-react'
import { Layer } from '../document/Layer'
import { Brush, ColorBrush } from '../document/Brush'
import { Movable } from './Movable'

function brushToCSS (brush: Brush) {
  if (brush instanceof ColorBrush) {
    return brush.color.toRGBString()
  } else {
    // TODO
    return 'black'
  }
}

function renderText (layer: Layer) {
  const { rect } = layer
  if (!layer.text.isEmpty) {
    const style: React.CSSProperties = {
      wordWrap: 'break-word'
    }
    const children: React.ReactChild[] = []
    for (const fragment of layer.text.fragments) {
      if (fragment.type === 'span') {
        children.push(<span>{fragment.characters.join('')}</span>)
      } else {
        children.push(<br />)
      }
    }
    return <foreignObject x={rect.left} y={rect.top} width={rect.width} height={rect.height}>
      <div style={style}>{children}</div>
    </foreignObject>
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
      <g>
        {styledElem}
        {renderText(layer)}
      </g>
    </Movable>
  }
}