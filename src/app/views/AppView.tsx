import * as React from 'react'
import { EditorView } from '../../editor/views/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
const styles = require('./AppView.css')

export class AppView extends React.Component {

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

if (module.hot) {
  module.hot.accept()
}
