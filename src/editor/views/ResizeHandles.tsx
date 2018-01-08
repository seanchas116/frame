import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { Vec2, Rect } from 'paintvec'
import { PointerEvents } from '../../support/PointerEvents'
import { Alignment } from '../../support/Types'
import { SizeLabel } from './SizeLabel'

const handleSize = 6

interface ResizeHandleProps {
  p1: Vec2
  p2: Vec2
  xAlign: Alignment
  yAlign: Alignment
  cursor: string
  snap: (pos: Vec2) => Vec2
  onChangeBegin: () => void
  onChange: (p1: Vec2, p2: Vec2) => void
  onChangeEnd: () => void
}

function coordForAlign (begin: number, end: number, align: Alignment) {
  switch (align) {
    case 'begin':
      return begin
    case 'center':
      return (begin + end) / 2
    case 'end':
      return end
  }
}

class ResizeHandle extends React.Component<ResizeHandleProps, {}> {
  private dragged = false
  private origPos = new Vec2()
  private dragStartPos = new Vec2()

  private get pos () {
    const x = coordForAlign(this.props.p1.x, this.props.p2.x, this.props.xAlign)
    const y = coordForAlign(this.props.p1.y, this.props.p2.y, this.props.yAlign)
    return new Vec2(x, y)
  }

  render () {
    const { x, y } = this.pos
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
    this.origPos = this.pos
    this.dragStartPos = new Vec2(e.clientX, e.clientY)
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    this.props.onChangeBegin()
  }
  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragged) {
      return
    }
    const eventPos = new Vec2(e.clientX, e.clientY)
    const pos = eventPos.sub(this.dragStartPos).add(this.origPos)
    const snapped = this.props.snap(pos)

    const x1 = this.props.xAlign === 'begin' ? snapped.x : this.props.p1.x
    const x2 = this.props.xAlign === 'end' ? snapped.x : this.props.p2.x
    const y1 = this.props.yAlign === 'begin' ? snapped.y : this.props.p1.y
    const y2 = this.props.yAlign === 'end' ? snapped.y : this.props.p2.y

    this.props.onChange(new Vec2(x1, y1), new Vec2(x2, y2))
  }
  private onPointerUp = (e: PointerEvent) => {
    this.dragged = false
    this.props.onChangeEnd()
  }
}

const handles: { align: [Alignment, Alignment], cursor: string }[] = [
  { align: ['begin', 'begin'], cursor: 'nwse-resize' },
  { align: ['center', 'begin'], cursor: 'ns-resize' },
  { align: ['end', 'begin'], cursor: 'nesw-resize' },
  { align: ['end', 'center'], cursor: 'ew-resize' },
  { align: ['end', 'end'], cursor: 'nwse-resize' },
  { align: ['center', 'end'], cursor: 'ns-resize' },
  { align: ['begin', 'end'], cursor: 'nesw-resize' },
  { align: ['begin', 'center'], cursor: 'ew-resize' }
]

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
    const rect = Rect.fromTwoPoints(this.props.p1, this.props.p2)

    return <g>
      <rect x={rect.left + 0.5} y={rect.top + 0.5} width={rect.width - 1} height={rect.height - 1} stroke='lightgray' fill='transparent' pointerEvents='none' />
      {
        handles.map(({ cursor, align }, i) =>
          <ResizeHandle
            key={i}
            cursor={cursor}
            p1={this.props.p1}
            p2={this.props.p2}
            xAlign={align[0]}
            yAlign={align[1]}
            snap={pos => this.props.snap(pos, align[0], align[1])}
            onChange={(p1, p2) => this.props.onChange(p1, p2)}
            onChangeBegin={this.onChangeBegin}
            onChangeEnd={this.onChangeEnd}
          />
        )
      }
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
