import * as React from 'react'
import { observer } from 'mobx-react'
import { action, reaction, computed, observable } from 'mobx'
import { Rect, Vec2 } from 'paintvec'
import { ResizeHandles } from './ResizeHandles'
import { Alignment } from '../../core/common/Types'
import { Layer } from '../../core/document/Layer'
import { layerSnapper } from './LayerSnapper'
import { editor } from '../state/Editor';

@observer
export
class LayerResizeHandles extends React.Component<{layers: Layer[]}, {}> {
  private dragging = false
  private disposers: (() => void)[] = []
  @observable private positions: [Vec2, Vec2] | undefined
  private originalPositions: [Vec2, Vec2] | undefined
  private originalRects = new Map<Layer, Rect>()

  @computed get rect () {
    return Rect.union(...this.props.layers.map(i => i.rect))
  }

  componentDidMount () {
    this.updatePositions()
    this.disposers.push(
      reaction(() => this.rect, () => {
        if (!this.dragging) {
          this.updatePositions()
        }
      })
    )
  }

  componentWillUnmount () {
    this.disposers.forEach(f => f())
  }

  render () {
    const { positions } = this
    if (!positions) {
      return <g />
    }
    return <ResizeHandles
      p1={positions[0]}
      p2={positions[1]}
      snap={this.snap}
      onChangeBegin={this.onChangeBegin}
      onChange={this.onChange}
      onChangeEnd={this.onChangeEnd}
    />
  }

  private snap = (pos: Vec2, xAlign: Alignment, yAlign: Alignment) => {
    if (this.rect) {
      return layerSnapper.snapPos(pos, xAlign, yAlign)
    } else {
      return pos
    }
  }

  @action private onChangeBegin = () => {
    this.dragging = true
    this.originalPositions = this.positions
    for (const layer of this.props.layers) {
      this.originalRects.set(layer, layer.rect)
    }
    layerSnapper.setTargetLayers(this.props.layers)
  }

  @action private onChange = (p1: Vec2, p2: Vec2) => {
    if (!this.originalPositions) {
      return
    }
    for (const [layer, origRect] of this.originalRects) {
      const [origP1, origP2] = this.originalPositions
      const ratio = p2.sub(p1).div(origP2.sub(origP1))
      const topLeft = origRect.topLeft.sub(origP1).mul(ratio).add(p1)
      const bottomRight = origRect.bottomRight.sub(origP1).mul(ratio).add(p1)
      const rect = Rect.fromTwoPoints(topLeft, bottomRight)
      layer.rect = rect
    }

    this.positions = [p1, p2]
  }

  @action private onChangeEnd = () => {
    editor.document.commit('Resize Layers')

    this.dragging = false
    this.originalPositions = undefined
    this.originalRects = new Map()

    this.updatePositions()
    layerSnapper.clear()
  }

  private updatePositions () {
    const { rect } = this
    if (rect) {
      this.positions = [rect.topLeft, rect.bottomRight]
    } else {
      this.positions = undefined
    }
  }
}
