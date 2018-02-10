import * as React from 'react'
import { action } from 'mobx'
import styled from 'styled-components'
import { TextFragment } from '../../core/document/Text'
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
    for (const fragment of text.fragments) {
      if (fragment.type === 'span') {
        const spanElem = document.createElement('span')
        spanElem.innerText = fragment.characters.join('')
        this.editable.appendChild(spanElem)
      } else {
        this.editable.appendChild(document.createElement('br'))
      }
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
    const fragments: TextFragment[] = []
    for (const child of this.editable.childNodes) {
      // TODO: handle nested <br>
      if (child instanceof HTMLBRElement) {
        fragments.push({
          type: 'break'
        })
      } else {
        fragments.push({
          type: 'span',
          characters: [...(child.textContent || '')]
        })
      }
    }
    this.props.layer.text.fragments.replace(fragments)
  }
}
