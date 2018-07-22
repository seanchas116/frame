import * as React from 'react'
import { action, computed, reaction } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { Document } from '../../core/document/Document'
import { editor } from './Editor'
import { Disposable, disposeAll } from '../../lib/Disposable'
import { toCSSTransform } from '../../lib/CSSTransform'
import { AttributedTextStyle, AttributedTextSpan, AttributedTextLine } from '../../core/document/AttributedText'
import { ValueRange } from '../../lib/ValueRange'
import { RGBColor } from '../../lib/Color'
import { DOMPosition } from '../../lib/DOMPosition'
import { TextShape } from '../../core/document/Shape'
import { Layer } from '../../core/document/Layer'

const TextEditorWrap = styled.div`
  position: absolute;
`

const TextEditorArea = styled.div`
  position: absolute;
  line-height: 0;
`

const TextEditorEditable = styled.div`
  display: inline-block;
  outline: none;
`

function setStyle (element: HTMLElement, style: AttributedTextStyle) {
  Object.assign(element.style, {
    fontFamily: style.family,
    fontSize: style.size + 'px',
    lineHeight: style.size + 'px',
    fontWeight: style.weight as any,
    color: style.color.toRGB().toRGBString()
  })
}

@observer export class TextEdior extends React.Component<{layer: Layer, shape: TextShape}> {
  private editable!: HTMLElement
  private lastLines: AttributedTextLine[] = []
  private disposables: Disposable[] = []

  @computed get lines () {
    return Array.from(this.props.shape.text.lines)
  }

  componentDidMount () {
    document.addEventListener('selectionchange', this.handleSelectionChange)
    this.disposables = [
      reaction(() => this.lines, lines => {
        if (!_.isEqual(lines, this.lastLines)) {
          this.updateDOM()
        }
      })
    ]
    this.updateDOM()
  }

  componentWillUnmount () {
    document.removeEventListener('selectionchange', this.handleSelectionChange)
    disposeAll(this.disposables)
  }

  render () {
    const { left, top, width, height } = this.props.layer.rect
    const transform = toCSSTransform(editor.scroll.documentToViewport)
    const style = {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    }
    return <TextEditorWrap style={{ transform }}>
      <TextEditorArea style={style}>
        <TextEditorEditable
          innerRef={e => this.editable = e!}
          style={style}
          onInput={this.handleInput}
          contentEditable={true}
        />
      </TextEditorArea>
    </TextEditorWrap>
  }

  private updateDOM () {
    // TODO: keep selection
    while (this.editable.firstChild) {
      this.editable.removeChild(this.editable.firstChild)
    }

    const { text } = this.props.shape
    setStyle(this.editable, AttributedTextStyle.default)
    if (text.isEmpty) {
      this.editable.style.lineHeight = '0'
    }
    for (const line of text.lines) {
      for (const span of line.spans) {
        const spanElem = document.createElement('span')
        spanElem.appendChild(document.createTextNode(span.content))
        setStyle(spanElem, span.style)
        this.editable.appendChild(spanElem)
      }
      this.editable.appendChild(document.createElement('br'))
    }
    this.lastLines = Array.from(text.lines)

    setImmediate(() => {
      this.reselectRange()
    })
  }

  private reselectRange () {
    const textRange = Document.current.textSelection.range
    if (textRange) {
      const start = DOMPosition.fromOffsetFromNode(this.editable, textRange.begin)
      const end = DOMPosition.fromOffsetFromNode(this.editable, textRange.end)
      if (start && end) {
        const range = document.createRange()
        range.setStart(start.node, start.offset)
        range.setEnd(end.node, end.offset)
        console.log(range)
        const selection = document.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  @action private handleInput = () => {
    let lines: AttributedTextLine[] = []
    const getTextStyle = (element: HTMLElement): AttributedTextStyle => {
      const style = getComputedStyle(element)
      return new AttributedTextStyle(
        style.fontFamily || AttributedTextStyle.default.family,
        Number.parseInt(style.fontSize!.slice(0, -2), 10),
        Number.parseInt(style.fontWeight!, 10),
        RGBColor.fromString(style.color!).toHSV()
      )
    }

    let line = new AttributedTextLine([])

    const iterateChildren = (children: NodeList) => {
      for (const child of children) {
        if (child instanceof HTMLBRElement) {
          lines.push(line)
          line = new AttributedTextLine([])
        } else if (child instanceof Text && child.textContent) {
          line.spans.push(new AttributedTextSpan(child.textContent, getTextStyle(child.parentElement!)))
        } else if (child instanceof HTMLSpanElement) {
          iterateChildren(child.childNodes)
        }
      }
    }
    iterateChildren(this.editable.childNodes)
    if (lines.length > 0 && lines[lines.length - 1].isEmpty) { // trim last <br>
      lines.pop()
    }
    this.props.shape.text.lines.replace(lines)
    this.props.shape.text.shrink()
    this.lastLines = Array.from(this.props.shape.text.lines)
  }

  @action private handleSelectionChange = () => {
    const selection = getSelection()
    if (!this.editable.contains(selection.anchorNode) || !this.editable.contains(selection.focusNode)) {
      return
    }
    const begin = new DOMPosition(selection.anchorNode, selection.anchorOffset).offsetFromNode(this.editable)
    const end = new DOMPosition(selection.focusNode, selection.focusOffset).offsetFromNode(this.editable)
    Document.current.textSelection.range = ValueRange.fromValues(begin, end)
  }
}
