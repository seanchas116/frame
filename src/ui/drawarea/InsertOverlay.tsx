import * as React from 'react'
import { Vec2 } from 'paintvec'
import { PointerEvents } from '../common/PointerEvents'
const styles = require('./InsertOverlay.css')

export class InsertOverlay extends React.Component<{size: Vec2}> {
  render () {
    const { width, height } = this.props.size
    const style = {
      width: `${width}px`,
      height: `${height}px`
    }
    return <PointerEvents>
      return <div className={styles.InsertOverlay} style={style} />
    </PointerEvents>
  }
}
