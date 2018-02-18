import * as React from 'react'
import { action } from 'mobx'
import { Rect } from 'paintvec'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { RGBColor } from '../../lib/Color'
import { Document } from '../../core/document/Document'
import { Layer } from '../../core/document/Layer'
import { StrokeAlignment } from '../../core/document/Style'
import { ColorBrush } from '../../core/document/Brush'
import { NumberInput } from './components/NumberInput'

const Panel = styled.div`
  margin-bottom: 8px;
`

const PanelHeader = styled.div`
  height: 24px;
  line-height: 24px;
  font-size: 14px;
`

const PositionRow = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`

const PositionColumn = styled.label`
  display: flex;
  align-items: center;
  margin-right: 8px;
`

const PositionLabel = styled.div`
  width: 12px;
  font-size: 12px;
`

const PositionInput = styled(NumberInput)`
  width: 48px;
`

@observer class RectPanel extends React.Component<{layer: Layer}> {
  render () {
    const { rect } = this.props.layer
    return <Panel>
      <PanelHeader>Position</PanelHeader>
      <PositionRow>
        {this.renderColumn('x', rect.left, this.handleLeftChange)}
        {this.renderColumn('y', rect.top, this.handleTopChange)}
      </PositionRow>
      <PositionRow>
        {this.renderColumn('w', rect.width, this.handleWidthChange)}
        {this.renderColumn('h', rect.height, this.handleHeightChange)}
      </PositionRow>
    </Panel>
  }

  private renderColumn (name: string, value: number, onChange: (value: number) => void) {
    return <PositionColumn>
      <PositionLabel>{name}</PositionLabel>
      <PositionInput value={value} onChange={onChange} />
    </PositionColumn>
  }

  @action private handleLeftChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(value, layer.rect.top, layer.rect.width, layer.rect.height)
    Document.current.commit('Change Left')
  }

  @action private handleTopChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, value, layer.rect.width, layer.rect.height)
    Document.current.commit('Change Top')
  }

  @action private handleWidthChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, layer.rect.top, value, layer.rect.height)
    Document.current.commit('Change Width')
  }

  @action private handleHeightChange = (value: number) => {
    const { layer } = this.props
    layer.rect = Rect.fromWidthHeight(layer.rect.left, layer.rect.top, layer.rect.width, value)
    Document.current.commit('Change Height')
  }
}

const FillBorderRow = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 8px;
  }
  > input[type='number'] {
    width: 40px;
  }
`

@observer class FillPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.fill instanceof ColorBrush ? style.fill.color.toRGB().toHexRGBString() : '#000000'
    return <Panel>
      <PanelHeader>Fill</PanelHeader>
      <FillBorderRow>
        <input type='checkbox' checked={style.fillEnabled} onChange={this.handleEnabledChange} />
        <input type='color' value={color} onChange={this.handleColorChange} onBlur={this.handleColorChangeFinish}/>
      </FillBorderRow>
    </Panel>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    style.fillEnabled = e.currentTarget.checked
    Document.current.commit('Change Fill Enabled')
  }

  @action private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    const color = RGBColor.fromString(e.currentTarget.value)
    style.fill = new ColorBrush(color.toHSV())
  }

  @action private handleColorChangeFinish = () => {
    Document.current.commit('Change Fill Color')
  }
}

@observer class BorderPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    const color = style.stroke instanceof ColorBrush ? style.stroke.color.toRGB().toHexRGBString() : '#000000'
    return <Panel>
      <PanelHeader>Border</PanelHeader>
      <FillBorderRow>
        <input type='checkbox' checked={style.strokeEnabled} onChange={this.handleEnabledChange} />
        <input type='color' value={color} onChange={this.handleColorChange} onBlur={this.handleColorChangeFinish} />
        <select value={style.strokeAlignment} onChange={this.handleAlignmentChange}>
          <option value='inside'>Inside</option>
          <option value='center'>Center</option>
          <option value='outside'>Outside</option>
        </select>
        <NumberInput value={style.strokeWidth} onChange={this.handleWidthChange}/>
      </FillBorderRow>
    </Panel>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    style.strokeEnabled = e.currentTarget.checked
    Document.current.commit('Change Border Enabled')
  }

  @action private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    const color = RGBColor.fromString(e.currentTarget.value)
    style.stroke = new ColorBrush(color.toHSV())
  }

  @action private handleColorChangeFinish = () => {
    Document.current.commit('Change Border Color')
  }

  @action private handleAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { style } = this.props.layer
    style.strokeAlignment = e.currentTarget.value as StrokeAlignment
    Document.current.commit('Change Border Alignment')
  }

  @action private handleWidthChange = (value: number) => {
    const { style } = this.props.layer
    style.strokeWidth = value
    Document.current.commit('Change Border Width')
  }
}

const LayerInspector = (props: {layer: Layer}) => {
  return <div>
    <RectPanel layer={props.layer} />
    <FillPanel layer={props.layer} />
    <BorderPanel layer={props.layer} />
  </div>
}

class TextInspector extends React.Component<{layer: Layer}> {
  render () {
    const size = 12
    return <div>
      <div>
        <label>Size<NumberInput value={size} onChange={this.handleSizeChange} /></label>
      </div>
      <div>
      <label>Color<input type='color' onChange={this.handleColorChange} /></label>
      </div>
    </div>
  }

  private handleSizeChange = (value: number) => {
    // TODO
  }
  private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO
  }
}

const InspectorWrap = styled.div`
  width: 240px;
  padding: 8px;
  box-sizing: border-box;
  background-color: var(--front-color);
  border-left: 2px solid var(--background-color);
`

@observer export class Inspector extends React.Component {
  render () {
    const layer: Layer | undefined = Document.current.selection.layers[0]
    const focusedLayer = Document.current.focusedLayer

    let inspector: React.ReactNode | undefined
    if (focusedLayer) {
      inspector = <TextInspector layer={focusedLayer} />
    } else if (layer) {
      inspector = <LayerInspector layer={layer} />
    }

    return <InspectorWrap>
      {inspector}
    </InspectorWrap>
  }
}
