import * as React from 'react'
import { Vec2, Rect } from 'paintvec'
import { computed, action } from 'mobx'
import { PointerEvents } from '../../lib/PointerEvents'
import { Layer } from '../document/Layer'
import { layerSnapper } from './LayerSnapper'
import { editor } from './Editor'

export
class Movable extends React.Component<{layer: Layer, movable?: boolean}, {}> {
  private dragOrigin = new Vec2()
  private dragging = false
  private originalRects = new Map<Layer, Rect>()
  private originalRect: Rect | undefined = undefined

  @computed get clickThrough () {
    const { layer } = this.props
    return editor.document.selection.layers.some(selected => layer.children.includes(selected))
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
    editor.document.selection.replace([layer])
    editor.document.focusedLayer = layer
    event.stopPropagation()
  }

  @action private onPointerDown = (event: PointerEvent) => {
    if (this.clickThrough) {
      return
    }
    event.stopPropagation()
    if (event.shiftKey) {
      editor.document.selection.add(this.props.layer)
    } else {
      editor.document.selection.replace([this.props.layer])
    }
    const layers = editor.document.selection.layers
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
    const offset = pos.sub(this.dragOrigin)
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

    editor.document.commit('Move Layers')
  }

  private cancel () {
    this.dragging = false
    this.originalRects = new Map()
    this.originalRect = undefined
    layerSnapper.clear()
  }
}