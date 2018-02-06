import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Vec2 } from 'paintvec'
import { editor } from './Editor'
import { LayerView } from './LayerView'
import { InsertOverlay } from './InsertOverlay'
import { SnapLines } from './SnapLines'
import { layerSnapper } from './LayerSnapper'
import { LayerResizeHandles } from './LayerResizeHandles'
import { isTextInput } from '../../lib/isTextInput'
import { toCSSTransform } from '../../lib/CSSTransform'
import { TextEditorOverlay } from './TextEditorOverlay'
import { Document } from '../../core/document/Document'
import * as styles from './EditorView.scss'

@observer export class EditorView extends React.Component {
  @observable static instance: EditorView | undefined

  size = new Vec2(100, 100)

  private element!: HTMLElement
  private resizeObserver!: ResizeObserver

  @action componentDidMount () {
    EditorView.instance = this
    this.handleResize()
    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(this.element)
    document.addEventListener('keydown', this.handleDocumentKeyDown)
  }

  @action componentWillUnmount () {
    EditorView.instance = undefined
    this.resizeObserver.unobserve(this.element)
    document.removeEventListener('keydown', this.handleDocumentKeyDown)
  }

  render () {
    const { width, height } = this.size
    const document = Document.current
    const selectedLayers = document.selection.layers
    const { focusedLayer } = document

    const layerViews = document.rootGroup.children.map(layer => <LayerView key={layer.key} layer={layer} />)
    layerViews.reverse()

    return <div className={styles.EditorView} ref={e => this.element = e!} onWheel={this.handleWheel} >
      <svg className={styles.svg} width={width} height={height}>
        <rect className={styles.background} x={0} y={0} width={width} height={height} onClick={this.handleClickBackground}/>
        <g transform={toCSSTransform(editor.scroll.documentToViewport)}>
          {layerViews}
        </g>
        <SnapLines snapper={layerSnapper} />
        {selectedLayers.length > 0 && <LayerResizeHandles layers={selectedLayers} />}
      </svg>
      {focusedLayer && <TextEditorOverlay layer={focusedLayer}/>}
      {editor.insertMode && <InsertOverlay />}
    </div>
  }

  @action private handleResize = () => {
    const clientRect = this.element.getBoundingClientRect()
    this.size = new Vec2(clientRect.width, clientRect.height)
  }

  @action private handleClickBackground = (e: React.MouseEvent<SVGRectElement>) => {
    if (!e.shiftKey) {
      Document.current.selection.clear()
    }
  }

  @action private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (!isTextInput(e.target)) {
        Document.current.deleteLayers()
        Document.current.commit('Delete Layers')
      }
    }
  }

  @action private handleWheel = (e: React.WheelEvent<HTMLElement>) => {
    editor.scroll.translation = editor.scroll.translation.sub(new Vec2(e.deltaX, e.deltaY))
  }
}
