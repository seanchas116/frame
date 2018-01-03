import * as React from 'react'
import { EditorView } from '../../editor/views/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import '../menu/MenuBar'
import { WindowTitleUpdater } from '../window/WindowTitleUpdater'
const styles = require('./AppView.css')

export class AppView extends React.Component {
  titleUpdater: WindowTitleUpdater

  componentDidMount () {
    this.titleUpdater = new WindowTitleUpdater()
  }

  componentWillUnmount () {
    this.titleUpdater.dispose()
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

if (module.hot) {
  module.hot.accept()
}
