import * as React from 'react'
import { action } from 'mobx'
import { Rect } from 'paintvec'
import { observer } from 'mobx-react'
import { RGBColor } from '../../lib/Color'
import { Layer } from '../../core/document/Layer'
import { StrokeAlignment } from '../../core/document/Style'
import { ColorBrush } from '../../core/document/Brush'
import { fileStore } from '../file/FileStore'
import { NumberInput } from './components/NumberInput'
import * as styles from './Inspector.scss'

@observer class RectPanel extends React.Component<{layer: Layer}> {
  render () {
    const { rect } = this.props.layer
    return <div className={styles.numberPanel}>
      <div className={styles.header}>Position</div>
      <div className={styles.row}>
        {this.renderColumn('x', rect.left, this.handleLeftChange)}
        {this.renderColumn('y', rect.top, this.handleTopChange)}
      </div>
      <div className={styles.row}>
        {this.renderColumn('w', rect.width, this.handleWidthChange)}
        {this.renderColumn('h', rect.height, this.handleHeightChange)}
      </div>
    </div>
  }

  private renderColumn (name: string, value: number, onChange: (value: number) => void) {
    return <label className={styles.column}>
      <div className={styles.label}>{name}</div>
      <NumberInput className={styles.input} value={value} onChange={onChange} />
    </label>
  }

  @action private handleLeftChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(value, layer.rect.top, layer.rect.width, layer.rect.height)
    layer.document.commit('Change Left')
  }

  @action private handleTopChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, value, layer.rect.width, layer.rect.height)
    layer.document.commit('Change Top')
  }

  @action private handleWidthChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, layer.rect.top, value, layer.rect.height)
    layer.document.commit('Change Width')
  }

  @action private handleHeightChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, layer.rect.top, layer.rect.width, value)
    layer.document.commit('Change Height')
  }
}

@observer class FillPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.fill instanceof ColorBrush ? style.fill.color.toRGB().toHexRGBString() : '#000000'
    return <div className={styles.panel}>
      <div className={styles.header}>Fill</div>
      <div className={styles.fillBorderRow}>
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

@observer class BorderPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.stroke instanceof ColorBrush ? style.stroke.color.toRGB().toHexRGBString() : '#000000'
    return <div className={styles.panel}>
      <div className={styles.header}>Border</div>
      <div className={styles.fillBorderRow}>
        <input type='checkbox' checked={style.strokeEnabled} onChange={this.handleEnabledChange} />
        <input type='color' value={color} onChange={this.handleColorChange} onBlur={this.handleColorChangeFinish} />
        <select value={style.strokeAlignment} onChange={this.handleAlignmentChange}>
          <option value='inside'>Inside</option>
          <option value='center'>Center</option>
          <option value='outside'>Outside</option>
        </select>
        <NumberInput value={style.strokeWidth} onChange={this.handleWidthChange}/>
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

  @action private handleWidthChange = (value: number) => {
    const { style, document } = this.props.layer
    style.strokeWidth = value
    document.commit('Change Border Width')
  }
}

@observer export class Inspector extends React.Component {
  render () {
    const layer: Layer | undefined = fileStore.document.selection.layers[0]
    return <div className={styles.Inspector}>
      {layer && <RectPanel layer={layer} />}
      {layer && <FillPanel layer={layer} />}
      {layer && <BorderPanel layer={layer} />}
    </div>
  }
}
