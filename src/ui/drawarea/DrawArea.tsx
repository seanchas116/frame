import * as React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Rect } from 'paintvec'
import { app } from '../../core/app/App'
import { LayerView } from './LayerView'
const styles = require('./DrawArea.css')

interface ResizeObserver {
  observe (e: Element): void
  unobserve (e: Element): void
}

interface ResizeObserverStatic {
  new (callback: () => void): ResizeObserver
}
declare var ResizeObserver: ResizeObserverStatic

@observer export class DrawArea extends React.Component {
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
    return <div className={styles.DrawArea} ref={e => this.element = e!}>
      <svg width={width} height={height}>
        {app.document.rootGroup.children.map(layer => <LayerView layer={layer} />)}
      </svg>
    </div>
  }

  private handleResize = () => {
    const clientRect = this.element.getBoundingClientRect()
    this.clientRect = Rect.fromWidthHeight(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
  }
}
