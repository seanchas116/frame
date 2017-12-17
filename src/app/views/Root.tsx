import * as React from 'react'
import { EditorView } from '../../editor/views/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
const styles = require('./Root.css')

export class Root extends React.Component {

  render () {
    return <div className={styles.Root}>
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
