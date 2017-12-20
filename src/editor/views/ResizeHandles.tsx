import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { Vec2, Rect } from 'paintvec'
import { PointerEvents } from '../common/PointerEvents'
import { Alignment } from '../../core/common/Types'
import { SizeLabel } from './SizeLabel'

const handleSize = 6

interface ResizeHandleProps {
  x: number
  y: number
  xAlign: Alignment
  yAlign: Alignment
  cursor: string
  snap: (pos: Vec2, xAlign: Alignment, yAlign: Alignment) => Vec2
  onChangeBegin: (xAlign: Alignment, yAlign: Alignment) => void
  onChange: (x: number, y: number, xAlign: Alignment, yAlign: Alignment) => void
  onChangeEnd: (xAlign: Alignment, yAlign: Alignment) => void
}

class ResizeHandle extends React.Component<ResizeHandleProps, {}> {
  private dragged = false
  private origX = 0
  private origY = 0
  private origClientX = 0
  private origClientY = 0

  render () {
    const { x, y } = this.props
    return <PointerEvents
      onPointerDown={this.onPointerDown}
      onPointerMove={this.onPointerMove}
      onPointerUp={this.onPointerUp}
    >
      <rect
        cursor={this.props.cursor}
        x={x - handleSize / 2} y={y - handleSize / 2}
        width={handleSize} height={handleSize}
        stroke='grey'
        fill='white'
      />
    </PointerEvents>
  }

  private onPointerDown = (e: PointerEvent) => {
    this.dragged = true
    this.origX = this.props.x
    this.origY = this.props.y
    this.origClientX = e.clientX
    this.origClientY = e.clientY
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    this.props.onChangeBegin(this.props.xAlign, this.props.yAlign)
  }
  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragged) {
      return
    }
    const x = e.clientX - this.origClientX + this.origX
    const y = e.clientY - this.origClientY + this.origY
    const snapped = this.props.snap(new Vec2(x, y), this.props.xAlign, this.props.yAlign)
    this.props.onChange(snapped.x, snapped.y, this.props.xAlign, this.props.yAlign)
  }
  private onPointerUp = (e: PointerEvent) => {
    this.dragged = false
    this.props.onChangeEnd(this.props.xAlign, this.props.yAlign)
  }
}

interface ResizeHandlesProps {
  p1: Vec2
  p2: Vec2
  snap: (pos: Vec2, xAlign: Alignment, yAlign: Alignment) => Vec2
  onChangeBegin: () => void
  onChange: (p1: Vec2, p2: Vec2) => void
  onChangeEnd: () => void
}

@observer
export
class ResizeHandles extends React.Component<ResizeHandlesProps, {}> {
  @observable private dragged = false

  render () {
    const x1 = this.props.p1.x
    const y1 = this.props.p1.y
    const x2 = this.props.p2.x
    const y2 = this.props.p2.y
    const x = Math.min(x1, x2)
    const width = Math.max(x1, x2) - x
    const y = Math.min(y1, y2)
    const height = Math.max(y1, y2) - y
    const { onChangeBegin, onChangeEnd } = this
    const { onChange, snap } = this.props
    const rect = Rect.fromWidthHeight(x, y, width, height)

    return <g>
      <rect x={x + 0.5} y={y + 0.5} width={width - 1} height={height - 1} stroke='lightgray' fill='transparent' pointerEvents='none' />
      <ResizeHandle
        cursor='nwse-resize'
        x={x1} y={y1}
        xAlign='begin' yAlign='begin'
        snap={snap}
        onChange={(x1, y1) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='ns-resize'
        x={(x1 + x2) / 2} y={y1}
        xAlign='center' yAlign='begin'
        snap={snap}
        onChange={(_, y1) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='nesw-resize'
        x={x2} y={y1}
        xAlign='end' yAlign='begin'
        snap={snap}
        onChange={(x2, y1) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='ew-resize'
        x={x2} y={(y1 + y2) / 2}
        xAlign='end' yAlign='center'
        snap={snap}
        onChange={(x2, _) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='nwse-resize'
        x={x2} y={y2}
        xAlign='end' yAlign='end'
        snap={snap}
        onChange={(x2, y2) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='ns-resize'
        x={(x1 + x2) / 2} y={y2}
        xAlign='center' yAlign='end'
        snap={snap}
        onChange={(_, y2) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='nesw-resize'
        x={x1} y={y2}
        xAlign='begin' yAlign='end'
        snap={snap}
        onChange={(x1, y2) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      <ResizeHandle
        cursor='ew-resize'
        x={x1} y={(y1 + y2) / 2}
        xAlign='begin' yAlign='center'
        snap={snap}
        onChange={(x1, _) => onChange(new Vec2(x1, y1), new Vec2(x2, y2))}
        onChangeBegin={onChangeBegin} onChangeEnd={onChangeEnd}
      />
      {this.dragged && <SizeLabel rect={rect} />}
    </g>
  }

  @action private onChangeBegin = () => {
    this.dragged = true
    this.props.onChangeBegin()
  }
  @action private onChangeEnd = () => {
    this.dragged = false
    this.props.onChangeEnd()
  }
}
