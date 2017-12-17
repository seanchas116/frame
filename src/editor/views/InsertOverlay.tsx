import * as React from 'react'
import { Vec2, Rect } from 'paintvec'
import { action } from 'mobx'
import { PointerEvents } from '../common/PointerEvents'
import { Layer } from '../../core/document/Layer'
import { editor } from '../state/Editor'
import { Shape, ShapeType, RectShape, EllipseShape, TextShape } from '../../core/document/Shape'
const styles = require('./InsertOverlay.css')

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
    const docPos = eventPos.transform(editor.scroll.viewportToDocument)
    this.dragStartPos = docPos

    const layer = new Layer()
    layer.shape = createShape(editor.insertMode)
    layer.rect = new Rect(docPos, docPos)
    // TODO: insert after selected layer
    editor.document.rootGroup.children.push(layer)

    this.layer = layer
  }

  @action private handlePointerMove = (event: PointerEvent) => {
    if (!this.layer) {
      return
    }
    const eventPos = new Vec2(event.offsetX, event.offsetY)
    const docPos = eventPos.transform(editor.scroll.viewportToDocument)
    this.layer.rect = Rect.fromTwoPoints(this.dragStartPos, docPos)
  }

  @action private handlePointerUp = (event: PointerEvent) => {
    this.layer = undefined
    editor.insertMode = undefined
    // TODO: commit
  }
}
