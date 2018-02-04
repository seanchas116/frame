import * as React from 'react'
import { runInAction } from 'mobx'
import { FormatFileLoader } from '../../core/format/FormatFileLoader'
import { Document } from '../../core/document/Document'
import { EditorView } from '../editor/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import { Inspector } from './Inspector'
import * as styles from './AppView.scss'

export class AppView extends React.Component {
  render () {
    return <div className={styles.AppView} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
      {process.platform === 'darwin' && <div className={styles.titleBar} />}
      <div className={styles.columns}>
        <ToolBar />
        <LayerList />
        <EditorView />
        <Inspector />
      </div>
    </div>
  }

  private handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  private handleDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; ++i) {
      const file = files.item(i)
      const document = await FormatFileLoader.loadFile(file)
      runInAction(() => {
        if (document) {
          const layers = document.rootGroup.children.peek()
          Document.current.insertLayers(layers)
        }
      })
    }
  }
}
