import * as React from 'react'
import { EditorView } from '../../editor/views/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import '../menu/MenuBar'
import { WindowTitleUpdater } from '../window/WindowTitleUpdater'
import { Disposable, disposeAll } from '../../core/common/Disposable'
const styles = require('./AppView.css')

export class AppView extends React.Component {
  disposables: Disposable[]

  componentDidMount () {
    this.disposables = [
      new WindowTitleUpdater()
    ]
  }

  componentWillUnmount () {
    disposeAll(this.disposables)
  }

  render () {
    return <div className={styles.AppView}>
      <div className={styles.TitleBar} />
      <div className={styles.Columns}>
        <ToolBar />
        <LayerList />
        <EditorView />
      </div>
    </div>
  }
}
