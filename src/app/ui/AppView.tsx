import * as React from 'react'
import { EditorView } from '../editor/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import '../menu/MenuBar'
import { WindowTitleUpdater } from '../window/WindowTitleUpdater'
import { Disposable, disposeAll } from '../../lib/Disposable'
import { Inspector } from './Inspector'
import * as styles from './AppView.scss'

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
      {process.platform === 'darwin' && <div className={styles.titleBar} />}
      <div className={styles.columns}>
        <ToolBar />
        <LayerList />
        <EditorView />
        <Inspector />
      </div>
    </div>
  }
}
