import * as React from 'react'
import { action } from 'mobx'
import styled from 'styled-components'
import { TextSpan } from '../../core/document/Text'
import { Layer } from '../../core/document/Layer'
import { editor } from './Editor'
import { toCSSTransform } from '../../lib/CSSTransform'

const TextEditorWrap = styled.div`
  position: absolute;
`

const TextEditorArea = styled.div`
  position: absolute;
`

const TextEditorEditable = styled.div`
  display: inline-block;
  outline: none;
`

export class TextEdior extends React.Component<{layer: Layer}> {
  editable!: HTMLElement

  componentDidMount () {
    const { text } = this.props.layer
    for (const span of text.spans) {
      const spanElem = document.createElement('span')
      let chars: string[] = []
      for (const char of span.characters) {
        if (char === '\n') {
          spanElem.appendChild(document.createTextNode(chars.join('')))
          spanElem.appendChild(document.createElement('br'))
          chars = []
        } else {
          chars.push(char)
        }
      }
      spanElem.appendChild(document.createTextNode(chars.join('')))
      this.editable.appendChild(spanElem)
    }
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

  @action private handleInput = () => {
    const span: TextSpan = { characters: [] }
    const iterateChildren = (children: NodeList) => {
      for (const child of children) {
        if (child instanceof HTMLBRElement) {
          span.characters.push('\n')
        } else if (child instanceof Text && child.textContent) {
          span.characters.push(...child.textContent.split(''))
        } else if (child instanceof HTMLSpanElement) {
          iterateChildren(child.childNodes)
        }
      }
    }
    iterateChildren(this.editable.childNodes)
    this.props.layer.text.spans.replace([span])
  }
}
