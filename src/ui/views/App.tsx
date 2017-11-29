import * as React from 'react'
import { DrawArea } from '../drawarea/DrawArea'
import { ToolBar } from './ToolBar'
const styles = require('./App.css')

export class App extends React.Component {

  render () {
    return <div className={styles.App}>
      <div className={styles.TitleBar} />
      <div className={styles.Columns}>
        <ToolBar />
        <DrawArea />
      </div>
    </div>
  }
}

if (module.hot) {
  module.hot.accept()
}
