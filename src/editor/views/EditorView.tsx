import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Rect } from 'paintvec'
import { editor } from '../state/Editor'
import { LayerView } from './LayerView'
import { InsertOverlay } from './InsertOverlay'
import { SnapLines } from './SnapLines'
import { layerSnapper } from './LayerSnapper'
import { LayerResizeHandles } from './LayerResizeHandles'
import { isTextInput } from '../common/isTextInput'
import { TextEditorOverlay } from './TextEditorOverlay'
import * as styles from './EditorView.scss'

interface ResizeObserver {
  observe (e: Element): void
  unobserve (e: Element): void
}

interface ResizeObserverStatic {
  new (callback: () => void): ResizeObserver
}
declare var ResizeObserver: ResizeObserverStatic

@observer export class EditorView extends React.Component {
  @observable clientRect = new Rect()

  private element: HTMLElement
  private resizeObserver: ResizeObserver

  componentDidMount () {
    this.handleResize()
    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(this.element)
    document.addEventListener('keydown', this.handleDocumentKeyDown)
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.element)
    document.removeEventListener('keydown', this.handleDocumentKeyDown)
  }

  render () {
    const { width, height } = this.clientRect
    const selectedLayers = editor.document.selection.layers
    const { focusedLayer } = editor.document
    return <div className={styles.EditorView} ref={e => this.element = e!}>
      <svg className={styles.svg} width={width} height={height}>
        <rect className={styles.background} x={0} y={0} width={width} height={height} onClick={this.handleClickBackground}/>
        {editor.document.rootGroup.children.map(layer => <LayerView key={layer.key} layer={layer} />)}
        <SnapLines snapper={layerSnapper} />
        {selectedLayers.length > 0 && <LayerResizeHandles layers={selectedLayers} />}
      </svg>
      {focusedLayer && <TextEditorOverlay layer={focusedLayer}/>}
      {editor.insertMode && <InsertOverlay />}
    </div>
  }

  @action private handleResize = () => {
    const clientRect = this.element.getBoundingClientRect()
    this.clientRect = Rect.fromWidthHeight(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
  }

  @action private handleClickBackground = (e: React.MouseEvent<SVGRectElement>) => {
    if (!e.shiftKey) {
      editor.document.selection.clear()
    }
  }

  @action private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (!isTextInput(e.target)) {
        for (const selection of editor.document.selection.layers) {
          const parent = selection.parent
          if (parent) {
            parent.children.splice(parent.children.indexOf(selection), 1)
          }
        }
        editor.document.commit('Delete Layers')
      }
    }
  }
}
