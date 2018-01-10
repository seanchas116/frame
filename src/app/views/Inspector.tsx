import * as React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { RGBColor } from '../../support/Color'
import { Layer } from '../../core/document/Layer'
import { StrokeAlignment } from '../../core/document/Style'
import { ColorBrush } from '../../core/document/Brush'
import { fileStore } from '../state/FileStore'
import * as styles from './Inspector.scss'

@observer class FillPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.fill instanceof ColorBrush ? style.fill.color.toRGB().toHexRGBString() : '#000000'
    return <div className={styles.panel}>
      <div className={styles.header}>Fill</div>
      <div className={styles.fillStrokeRow}>
        <input type='checkbox' checked={style.fillEnabled} onChange={this.handleEnabledChange} />
        <input type='color' value={color} onChange={this.handleColorChange} onBlur={this.handleColorChangeFinish}/>
      </div>
    </div>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style, document } = this.props.layer
    style.fillEnabled = e.currentTarget.checked
    document.commit('Change Fill Enabled')
  }

  @action private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    const color = RGBColor.fromString(e.currentTarget.value)
    style.fill = new ColorBrush(color.toHSV())
  }

  @action private handleColorChangeFinish = () => {
    const { document } = this.props.layer
    document.commit('Change Fill Color')
  }
}

@observer class StrokePanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.stroke instanceof ColorBrush ? style.stroke.color.toRGB().toHexRGBString() : '#000000'
    return <div className={styles.panel}>
      <div className={styles.header}>Border</div>
      <div className={styles.fillStrokeRow}>
        <input type='checkbox' checked={style.strokeEnabled} onChange={this.handleEnabledChange} />
        <input type='color' value={color} onChange={this.handleColorChange} onBlur={this.handleColorChangeFinish} />
        <select value={style.strokeAlignment} onChange={this.handleAlignmentChange}>
          <option value='inside'>Inside</option>
          <option value='center'>Center</option>
          <option value='outside'>Outside</option>
        </select>
        <input type='number' value={style.strokeWidth} onChange={this.handleWidthChange}/>
      </div>
    </div>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style, document } = this.props.layer
    style.strokeEnabled = e.currentTarget.checked
    document.commit('Change Border Enabled')
  }

  @action private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    const color = RGBColor.fromString(e.currentTarget.value)
    style.stroke = new ColorBrush(color.toHSV())
  }

  @action private handleColorChangeFinish = () => {
    const { document } = this.props.layer
    document.commit('Change Border Color')
  }

  @action private handleAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { style, document } = this.props.layer
    style.strokeAlignment = e.currentTarget.value as StrokeAlignment
    document.commit('Change Border Alignment')
  }

  @action private handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style, document } = this.props.layer
    style.strokeWidth = parseFloat(e.currentTarget.value)
    document.commit('Change Border Width')
  }
}

@observer export class Inspector extends React.Component {
  render () {
    const layer: Layer | undefined = fileStore.document.selection.layers[0]
    return <div className={styles.Inspector}>
      {layer && <FillPanel layer={layer} />}
      {layer && <StrokePanel layer={layer} />}
    </div>
  }
}
