import * as React from 'react'
import { Vec2, Rect } from 'paintvec'
import { computed, action } from 'mobx'
import { PointerEvents } from '../../lib/PointerEvents'
import { Layer } from '../../core/document/Layer'
import { Document } from '../../core/document/Document'
import { layerSnapper } from './LayerSnapper'

export
class Movable extends React.Component<{layer: Layer, movable?: boolean}, {}> {
  private dragOrigin = new Vec2()
  private dragging = false
  private originalRects = new Map<Layer, Rect>()
  private originalRect: Rect | undefined = undefined

  @computed get clickThrough () {
    const { layer } = this.props
    return Document.current.selection.layers.some(selected => layer.children.includes(selected))
  }

  render () {
    const child = React.Children.only(this.props.children)
    const clickableBorder = this.props.layer.style.strokeEnabled && React.cloneElement(child, {
      fill: 'none',
      stroke: 'transparent',
      strokeWidth: 6
    })
    return <PointerEvents
      onPointerDownCapture={this.onPointerDown}
      onPointerMoveCapture={this.onPointerMove}
      onPointerUpCapture={this.onPointerUp}
      >
      <g onDoubleClick={this.onDoubleClick}>
        {clickableBorder}
        {child}
      </g>
    </PointerEvents>
  }

  @action private onDoubleClick = (event: React.MouseEvent<SVGGElement>) => {
    if (this.clickThrough) {
      return
    }
    this.cancel()
    const { layer } = this.props
    Document.current.selection.replace([layer])
    Document.current.focusedLayer = layer
    event.stopPropagation()
  }

  @action private onPointerDown = (event: PointerEvent) => {
    if (this.clickThrough) {
      return
    }
    event.stopPropagation()
    if (event.shiftKey) {
      Document.current.selection.add(this.props.layer)
    } else {
      Document.current.selection.replace([this.props.layer])
    }
    const layers = Document.current.selection.layers
    for (const layer of layers) {
      this.originalRects.set(layer, layer.rect)
    }
    this.originalRect = Rect.union(...this.originalRects.values())

    const movable = this.props.movable !== false
    if (movable) {
      const target = event.currentTarget as Element
      target.setPointerCapture(event.pointerId)
      this.dragOrigin = new Vec2(event.clientX, event.clientY)
      this.dragging = true
      layerSnapper.setTargetLayers([this.props.layer])
    }
  }
  @action private onPointerMove = (event: PointerEvent) => {
    if (this.clickThrough) {
      return
    }
    event.stopPropagation()
    if (!this.dragging || !this.originalRect) {
      return
    }
    const pos = new Vec2(event.clientX, event.clientY)
    const offset = pos.sub(this.dragOrigin).divScalar(Document.current.scroll.scale)
    const snappedRect = layerSnapper.snapRect(this.originalRect.translate(offset))
    const snappedOffset = snappedRect.topLeft.sub(this.originalRect.topLeft)
    for (const [layer, origRect] of this.originalRects.entries()) {
      layer.rect = origRect.translate(snappedOffset)
    }
  }
  @action private onPointerUp = (event: PointerEvent) => {
    if (this.clickThrough) {
      return
    }
    event.stopPropagation()
    if (!this.dragging) {
      return
    }
    this.cancel()

    Document.current.commit('Move Layers')
  }

  private cancel () {
    this.dragging = false
    this.originalRects = new Map()
    this.originalRect = undefined
    layerSnapper.clear()
  }
}
