import * as React from 'react'
import { observer } from 'mobx-react'
import { Snapper } from './Snapper'
import { Document } from '../../core/document/Document'

@observer
export class SnapLines extends React.Component<{snapper: Snapper}, {}> {
  render () {
    const { lines } = this.props.snapper
    const transform = Document.current.scroll.documentToViewport
    return <g pointerEvents='none'>
      {lines.map(([p1, p2], i) => {
        const p1Viewport = p1.transform(transform)
        const p2Viewport = p2.transform(transform)
        return <line key={i} stroke='blue' x1={p1Viewport.x} y1={p1Viewport.y} x2={p2Viewport.x} y2={p2Viewport.y} />
      })}
    </g>
  }
}
