import * as React from 'react'
import { action, computed } from 'mobx'
import { Rect } from 'paintvec'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { Document } from '../../core/document/Document'
import { Layer } from '../../core/document/Layer'
import { AttributedTextStyle } from '../../core/document/AttributedText'
import { StrokeAlignment } from '../../core/document/Style'
import { Brush } from '../../core/document/Brush'
import { NumberInput } from './components/NumberInput'
import { ColorInput } from './components/ColorInput'
import { BrushInput } from './components/BrushInput'
import { HSVColor } from '../../lib/Color'
import { TextShape } from '../../core/document/Shape'
import { fontRegistry } from '../font/FontRegistry'

const RowGroup = styled.div`
  margin-top: 8px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  > :not(:first-child) {
    margin-left: 8px;
  }
`

const Label = styled.div`
  font-size: 13px;
  width: 96px;
  line-height: 24px;
`

const LabelRow = styled(Label)`
  width: 100%;
  padding: 0 8px;
  border-top: 2px solid var(--background-color);
`

const RowNumberInput = styled(NumberInput)`
  width: 48px;
`

const InspectorWrap = styled.div`
  width: 240px;
  box-sizing: border-box;
  background-color: var(--front-color);
  border-left: 2px solid var(--background-color);
`

@observer class RectPanel extends React.Component<{layer: Layer}> {
  render () {
    const { rect } = this.props.layer
    return <RowGroup>
      <Row>
        <Label>Position</Label>
        <RowNumberInput value={rect.left} onChange={this.handleLeftChange} />
        <RowNumberInput value={rect.top} onChange={this.handleTopChange} />
      </Row>
      <Row>
        <Label>Size</Label>
        <RowNumberInput value={rect.width} onChange={this.handleWidthChange} />
        <RowNumberInput value={rect.height} onChange={this.handleHeightChange} />
      </Row>
    </RowGroup>
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

@observer class FillPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    return <RowGroup>
      <LabelRow>Fill</LabelRow>
      <Row>
        <input type='checkbox' checked={style.fillEnabled} onChange={this.handleEnabledChange} />
        <BrushInput value={style.fill} onChange={this.handleBrushChange} onChangeEnd={this.handleBrushChangeEnd}/>
      </Row>
    </RowGroup>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    style.fillEnabled = e.currentTarget.checked
    Document.current.commit('Change Fill Enabled')
  }

  @action private handleBrushChange = (brush: Brush) => {
    const { style } = this.props.layer
    style.fill = brush
  }

  @action private handleBrushChangeEnd = () => {
    Document.current.commit('Change Fill Color')
  }
}

@observer class BorderPanel extends React.Component<{layer: Layer}> {
  render () {
    const { style } = this.props.layer
    return <RowGroup>
      <LabelRow>Border</LabelRow>
      <Row>
        <input type='checkbox' checked={style.strokeEnabled} onChange={this.handleEnabledChange} />
        <BrushInput value={style.stroke} onChange={this.handleBrushChange} onChangeEnd={this.handleBrushChangeEnd} />
        <select value={style.strokeAlignment} onChange={this.handleAlignmentChange}>
          <option value='inside'>Inside</option>
          <option value='center'>Center</option>
          <option value='outside'>Outside</option>
        </select>
        <RowNumberInput value={style.strokeWidth} onChange={this.handleWidthChange}/>
      </Row>
    </RowGroup>
  }

  @action private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { style } = this.props.layer
    style.strokeEnabled = e.currentTarget.checked
    Document.current.commit('Change Border Enabled')
  }

  @action private handleBrushChange = (brush: Brush) => {
    const { style } = this.props.layer
    style.stroke = brush
  }

  @action private handleBrushChangeEnd = () => {
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

@observer class TextInspector extends React.Component<{layer: Layer, shape: TextShape}> {
  @computed private get combinedStyle () {
    const range = Document.current.textSelection.range
    return range ? this.props.shape.text.getStyle(range) : {}
  }

  @computed private get fontFamilyName () {
    return this.combinedStyle.family || AttributedTextStyle.default.family
  }

  @computed private get fontFamily () {
    return fontRegistry.families.get(this.fontFamilyName)
  }

  @computed private get fontStyle () {
    const family = this.fontFamily
    const styleWeight = family && [...family.styles].find(([style, weight]) => weight === this.combinedStyle.weight)
    return styleWeight ? styleWeight[0] : ''
  }

  render () {
    const size = this.combinedStyle.size || AttributedTextStyle.default.size
    const color = this.combinedStyle.color || AttributedTextStyle.default.color
    const fontFamilies = [...fontRegistry.families.values()]
    const fontStyles = this.fontFamily ? this.fontFamily.styles : new Map()

    return <RowGroup>
      <Row>
        <Label>Size</Label>
        <RowNumberInput value={size} onChange={this.handleSizeChange} />
      </Row>
      <Row>
        <Label>Color</Label>
        <ColorInput value={color} onChange={this.handleColorChange} onChangeEnd={this.handleColorChangeEnd}/>
      </Row>
      <Row>
        <Label>Family</Label>
        <select value={this.fontFamilyName} onChange={this.handleFamilyChange}>{
          fontFamilies.map(family => <option value={family.name}>{family.name}</option>)
        }</select>
      </Row>
      <Row>
        <Label>Style</Label>
        <select value={this.fontStyle} onChange={this.handleStyleChange}>{
          [...fontStyles.keys()].map(style => <option value={style}>{style}</option>)
        }</select>
      </Row>
    </RowGroup>
  }

  @action private handleSizeChange = (value: number) => {
    this.changeTextStyle({ size: value }, 'Change Text Size')
  }
  @action private handleColorChange = (value: HSVColor) => {
    const range = Document.current.textSelection.range
    if (!range) {
      return
    }
    this.props.shape.text.setStyle(range, { color: value })
  }
  @action private handleColorChangeEnd = () => {
    Document.current.commit('Change Text Color')
  }
  @action private handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const family = event.currentTarget.value
    this.changeTextStyle({ family: family }, 'Change Font Family')
  }
  @action private handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!this.fontFamily) {
      return
    }
    const style = event.currentTarget.value
    const weight = this.fontFamily.styles.get(style)
    if (!weight) {
      return
    }
    this.changeTextStyle({ weight: weight }, 'Change Font Weight')
  }

  private changeTextStyle (style: Partial<AttributedTextStyle>, commitMessage: string) {
    const range = Document.current.textSelection.range
    if (!range) {
      return
    }
    this.props.shape.text.setStyle(range, style)
    Document.current.commit(commitMessage)
  }
}

@observer export class Inspector extends React.Component {
  render () {
    const layer: Layer | undefined = Document.current.selection.layers[0]
    const focusedLayer = Document.current.focusedLayer

    let inspector: React.ReactNode | undefined
    if (focusedLayer && focusedLayer.shape instanceof TextShape) {
      inspector = <TextInspector layer={focusedLayer} shape={focusedLayer.shape} />
    } else if (layer) {
      inspector = <LayerInspector layer={layer} />
    }

    return <InspectorWrap>
      {inspector}
    </InspectorWrap>
  }
}
