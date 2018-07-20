import * as React from 'react'
import { action, computed, reaction } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { Document } from '../../core/document/Document'
import { Layer } from '../../core/document/Layer'
import { editor } from './Editor'
import { Disposable, disposeAll } from '../../lib/Disposable'
import { toCSSTransform } from '../../lib/CSSTransform'
import { TextStyle, TextSpan } from '../../core/document/Text'
import { ValueRange } from '../../lib/ValueRange'
import { RGBColor } from '../../lib/Color'
import { DOMPosition } from '../../lib/DOMPosition'

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

function setStyle (element: HTMLElement, style: TextStyle) {
  Object.assign(element.style, {
    fontSize: style.size + 'px',
    lineHeight: style.size + 'px',
    fontWeight: style.weight as any,
    color: style.color.toRGB().toRGBString()
  })
}

@observer export class TextEdior extends React.Component<{layer: Layer}> {
  private editable!: HTMLElement
  private lastSpans: TextSpan[] = []
  private disposables: Disposable[] = []

  @computed get spans () {
    return Array.from(this.props.layer.text.spans)
  }

  componentDidMount () {
    document.addEventListener('selectionchange', this.handleSelectionChange)
    this.disposables = [
      reaction(() => this.spans, spans => {
        if (!_.isEqual(spans, this.lastSpans)) {
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

    const { text } = this.props.layer
    setStyle(this.editable, TextStyle.default)
    if (text.spans.length !== 0) {
      this.editable.style.lineHeight = '0'
    }
    for (const span of text.spans) {
      const spanElem = document.createElement('span')
      let chars: string[] = []
      for (const char of span.content) {
        if (char === '\n') {
          spanElem.appendChild(document.createTextNode(chars.join('')))
          spanElem.appendChild(document.createElement('br'))
          chars = []
        } else {
          chars.push(char)
        }
      }
      spanElem.appendChild(document.createTextNode(chars.join('')))
      setStyle(spanElem, span)
      this.editable.appendChild(spanElem)
    }
    this.lastSpans = Array.from(text.spans)

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
    let spans: TextSpan[] = []
    const getTextStyle = (element: HTMLElement): TextStyle => {
      const style = getComputedStyle(element)
      return {
        color: RGBColor.fromString(style.color!).toHSV(),
        size: Number.parseInt(style.fontSize!.slice(0, -2), 10),
        weight: Number.parseInt(style.fontWeight!, 10)
      }
    }

    const iterateChildren = (children: NodeList) => {
      for (const child of children) {
        if (child instanceof HTMLBRElement) {
          spans.push({ ...getTextStyle(child.parentElement!), content: '\n' })
        } else if (child instanceof Text && child.textContent) {
          spans.push({ ...getTextStyle(child.parentElement!), content: child.textContent })
        } else if (child instanceof HTMLSpanElement) {
          iterateChildren(child.childNodes)
        }
      }
    }
    iterateChildren(this.editable.childNodes)
    if (spans[spans.length - 1].content === '\n') { // trim last <br>
      spans.pop()
    }
    const shrinked = TextSpan.shrink(spans)
    this.lastSpans = shrinked
    this.props.layer.text.spans.replace(shrinked)
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
