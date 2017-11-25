import * as React from 'react'
import { DrawArea } from '../drawarea/DrawArea'
const styles = require('./App.css')

export class App extends React.Component {

  render () {
    return <div className={styles.App}>
      <DrawArea />
    </div>
  }
}
