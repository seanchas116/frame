import * as React from 'react'
import { observer } from 'mobx-react'
const styles = require('./LayerList.css')

@observer
export class LayerList extends React.Component {
  render () {
    return <div className={styles.LayerList}>
    </div>
  }
}
