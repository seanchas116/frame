import * as React from 'react'
import { action } from 'mobx'
import styled from 'styled-components'
import { Layer } from '../../core/document/Layer'
import { editor } from './Editor'
import { toCSSTransform } from '../../lib/CSSTransform'
import { defaultTextSpan } from '../../core/document/Text'

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
      this.editable.appendChild(spanElem)
    }

    document.addEventListener('selectionchange', this.handleSelectionChange)
  }

  componentWillUnmount () {
    document.removeEventListener('selectionchange', this.handleSelectionChange)
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
    let content = ''
    const iterateChildren = (children: NodeList) => {
      for (const child of children) {
        if (child instanceof HTMLBRElement) {
          content += '\n'
        } else if (child instanceof Text && child.textContent) {
          content += child.textContent
        } else if (child instanceof HTMLSpanElement) {
          iterateChildren(child.childNodes)
        }
      }
    }
    iterateChildren(this.editable.childNodes)
    const span = { ...defaultTextSpan, content }
    this.props.layer.text.spans.replace([span])
  }

  @action private handleSelectionChange = () => {
    const selection = getSelection()
    if (!this.editable.contains(selection.anchorNode) || !this.editable.contains(selection.focusNode)) {
      return
    }
    const from = offsetFromAncestorNode(this.editable, selection.anchorNode, selection.anchorOffset)
    const to = offsetFromAncestorNode(this.editable, selection.focusNode, selection.focusOffset)
    console.log('selection change', from, to)
  }
}

function offsetFromAncestorNode (ancestor: Node, container: Node, offset: number) {
  let count: number
  let child: Node | null
  let parent: Node
  if (container instanceof Text) {
    count = offset
    child = container.previousSibling
    parent = container.parentNode!
  } else {
    count = 0
    child = container.childNodes[offset - 1]
    parent = container
  }

  while (true) {
    while (child) {
      count += countNodeCharacters(child!)
      child = child!.previousSibling
    }
    if (parent === ancestor) {
      break
    } else {
      child = parent.previousSibling
      parent = parent.parentNode!
    }
  }
  return count
}

function countNodeCharacters (node: Node): number {
  if (node instanceof Text) {
    return node.data.length
  }
  if (node instanceof HTMLBRElement) {
    return 1
  }
  return Array.from(node.childNodes).reduce((a, x) => a + countNodeCharacters(x), 0)
}
