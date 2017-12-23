import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Rect } from 'paintvec'
import { editor } from '../state/Editor'
import { LayerView } from './LayerView'
import { InsertOverlay } from './InsertOverlay'
import { SnapLines } from './SnapLines'
import { layerSnapper } from './LayerSnapper'
import { LayerResizeHandles } from './LayerResizeHandles';
const styles = require('./EditorView.css')

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
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.element)
  }

  render () {
    const { width, height } = this.clientRect
    const selectedLayers = editor.selection.layers
    return <div className={styles.EditorView} ref={e => this.element = e!}>
      <svg className={styles.SVG} width={width} height={height}>
        <rect className={styles.SVGBackground} x={0} y={0} width={width} height={height} onClick={this.handleClickBackground}/>
        {editor.document.rootGroup.children.map(layer => <LayerView key={layer.key} layer={layer} />)}
        <SnapLines snapper={layerSnapper} />
        {selectedLayers.length > 0 && <LayerResizeHandles layers={selectedLayers} />}
      </svg>
      {editor.insertMode && <InsertOverlay />}
    </div>
  }

  private handleResize = () => {
    const clientRect = this.element.getBoundingClientRect()
    this.clientRect = Rect.fromWidthHeight(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
  }

  private handleClickBackground = (e: React.MouseEvent<SVGRectElement>) => {
    if (!e.shiftKey) {
      editor.selection.clear()
    }
  }
}
