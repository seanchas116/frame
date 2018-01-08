import * as React from 'react'
const styles = require('./Inspector.css')

export class Inspector extends React.Component {
  render () {
    return <div className={styles.Inspector}>
      <div className={styles.Header}>Fill</div>
      <div className={styles.FillRow}>
        <input type='checkbox' />
        <input type='color' />
      </div>
      <div className={styles.Header}>Border</div>
      <div className={styles.StrokeRow}>
        <input type='checkbox' />
        <input type='color' />
        <select>
          <option>Center</option>
        </select>
        <input type='number' />
      </div>
    </div>
  }
}
