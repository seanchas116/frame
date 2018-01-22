import * as React from 'react'
import { EditorView } from '../editor/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import { Inspector } from './Inspector'
import * as styles from './AppView.scss'

export class AppView extends React.Component {
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