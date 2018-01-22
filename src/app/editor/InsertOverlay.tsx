import * as React from 'react'
import { Vec2, Rect } from 'paintvec'
import { action } from 'mobx'
import { PointerEvents } from '../../lib/PointerEvents'
import { Layer } from '../document/Layer'
import { editor } from './Editor'
import { Shape, ShapeType, RectShape, EllipseShape, TextShape } from '../document/Shape'
import { ColorBrush } from '../document/Brush'
import * as styles from './InsertOverlay.scss'

function createShape (type: ShapeType): Shape {
  switch (type) {
    case 'rect':
      return new RectShape()
    case 'ellipse':
      return new EllipseShape()
    case 'text':
      return new TextShape()
    case 'image':
    case 'group':
      throw new Error('non-supported shape type')
  }
}

export class InsertOverlay extends React.Component {
  dragStartPos = new Vec2()
  layer: Layer | undefined = undefined

  render () {
    return <PointerEvents onPointerDown={this.handlePointerDown} onPointerMove={this.handlePointerMove} onPointerUp={this.handlePointerUp}>
      <div className={styles.InsertOverlay} />
    </PointerEvents>
  }

  @action private handlePointerDown = (event: PointerEvent) => {
    if (!editor.insertMode) {
      return
    }

    (event.currentTarget as Element).setPointerCapture(event.pointerId)
    const eventPos = new Vec2(event.offsetX, event.offsetY)
    const docPos = eventPos.transform(editor.document.scroll.viewportToDocument)
    this.dragStartPos = docPos

    const layer = editor.document.createLayer()
    layer.shape = createShape(editor.insertMode)
    layer.rect = new Rect(docPos, docPos)
    layer.style.fill = ColorBrush.fromString('#CCC')
    layer.style.stroke = ColorBrush.fromString('#000')
    // TODO: insert after selected layer
    editor.document.rootGroup.children.push(layer)

    this.layer = layer
  }

  @action private handlePointerMove = (event: PointerEvent) => {
    if (!this.layer) {
      return
    }
    const eventPos = new Vec2(event.offsetX, event.offsetY)
    const docPos = eventPos.transform(editor.document.scroll.viewportToDocument)
    this.layer.rect = Rect.fromTwoPoints(this.dragStartPos, docPos)
  }

  @action private handlePointerUp = (event: PointerEvent) => {
    this.layer = undefined
    editor.insertMode = undefined
    editor.document.commit('Insert Layer')
  }
}