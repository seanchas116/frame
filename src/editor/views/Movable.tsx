import * as React from 'react'
import { Vec2, Rect } from 'paintvec'
import { computed, action } from 'mobx'
import { PointerEvents } from '../common/PointerEvents'
import { Layer } from '../../core/document/Layer'
import { layerSnapper } from './LayerSnapper'
import { editor } from '../state/Editor'

export
class Movable extends React.Component<{layer: Layer, movable?: boolean}, {}> {
  private dragOrigin = new Vec2()
  private dragging = false
  private items = new Set<Layer>()
  private originalRects = new Map<Layer, Rect>()
  private originalRect: Rect | undefined

  @computed get clickThrough () {
    const { layer } = this.props
    return editor.selection.layers.some(selected => layer.children.includes(selected))
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
    editor.selection.replace([layer])
    editor.focusedLayer = layer
    event.stopPropagation()
  }

  @action private onPointerDown = (event: PointerEvent) => {
    if (this.clickThrough) {
      return
    }
    event.stopPropagation()
    if (event.shiftKey) {
      editor.selection.add(this.props.layer)
    } else {
      editor.selection.replace([this.props.layer])
    }
    this.items = new Set(editor.selection.layers)
    for (const item of this.items) {
      this.originalRects.set(item, item.rect)
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
    for (const item of this.items) {
      const origRect = this.originalRects.get(item)!
      item.rect = origRect.translate(snappedOffset)
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
    // TODO: commit
  }

  private cancel () {
    this.dragging = false
    this.items = new Set()
    this.originalRects = new Map()
    this.originalRect = undefined
    layerSnapper.clear()
  }
}
