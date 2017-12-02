import * as React from 'react'
import { Vec2 } from 'paintvec'
import { action } from 'mobx'
import { PointerEvents } from '../common/PointerEvents'
const styles = require('./InsertOverlay.css')

export class InsertOverlay extends React.Component<{size: Vec2}> {
  dragStartPos: Vec2 | undefined = undefined

  render () {
    const { width, height } = this.props.size
    const style = {
      width: `${width}px`,
      height: `${height}px`
    }
    return <PointerEvents onPointerDown={this.handlePointerDown} onPointerMove={this.handlePointerMove} onPointerUp={this.handlePointerUp}>
      return <div className={styles.InsertOverlay} style={style} />
    </PointerEvents>
  }

  @action private handlePointerDown = (event: PointerEvent) => {
    (event.currentTarget as Element).setPointerCapture(event.pointerId)
    const eventPos = new Vec2(event.offsetX, event.offsetY)
    this.dragStartPos = eventPos
  }

  @action private handlePointerMove = (event: PointerEvent) => {
    // TODO
  }

  @action private handlePointerUp = (event: PointerEvent) => {
    this.dragStartPos = undefined
  }
}
