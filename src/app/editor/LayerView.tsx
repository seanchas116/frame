import * as React from 'react'
import { observer } from 'mobx-react'
import { Layer } from '../../core/document/Layer'
import { Brush, ColorBrush } from '../../core/document/Brush'
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
      wordWrap: 'break-word',
      cursor: 'default',
      lineHeight: 0
    }
    const spans: React.ReactChild[] = []
    for (const span of layer.text.spans) {
      const children: React.ReactChild[] = []
      let chars: string[] = []
      for (const char of span.content) {
        if (char === '\n') {
          children.push(chars.join(''))
          children.push(<br />)
          chars = []
        } else {
          chars.push(char)
        }
      }
      children.push(chars.join(''))
      const spanStyle: React.CSSProperties = {
        fontSize: span.size + 'px',
        lineHeight: span.size + 'px',
        fontWeight: span.weight as any,
        color: span.color.toRGB().toRGBString()
      }
      spans.push(<span style={spanStyle}>{children}</span>)
    }
    return <foreignObject x={rect.left} y={rect.top} width={rect.width} height={rect.height}>
      <div style={style}>{spans}</div>
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
