import * as React from 'react'
import { observer } from 'mobx-react'
import { Layer } from '../../core/document/Layer'
import { fileStore } from '../state/FileStore'
import * as styles from './Inspector.css'

const FillPanel = observer((props: {layer: Layer}) => {
  return <div className={styles.Panel}>
    <div className={styles.Header}>Fill</div>
    <div className={styles.FillStrokeRow}>
      <input type='checkbox' />
      <input type='color' />
    </div>
  </div>
})

const StrokePanel = observer((props: {layer: Layer}) => {
  return <div className={styles.Panel}>
    <div className={styles.Header}>Border</div>
    <div className={styles.FillStrokeRow}>
      <input type='checkbox' />
      <input type='color' />
      <select>
        <option>Center</option>
      </select>
      <input type='number' />
    </div>
  </div>
})

@observer export class Inspector extends React.Component {
  render () {
    const layer: Layer | undefined = fileStore.document.selection.layers[0]
    return <div className={styles.Inspector}>
      {layer && <FillPanel layer={layer} />}
      {layer && <StrokePanel layer={layer} />}
    </div>
  }
}
