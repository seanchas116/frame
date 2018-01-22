import * as React from 'react'
import { action } from 'mobx'
import { TextFragment } from '../document/Text'
import { Layer } from '../document/Layer'
import * as styles from './TextEditor.scss'

export class TextEdior extends React.Component<{layer: Layer}> {
  editable: HTMLElement

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
    const style = {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    }
    return <div style={style} className={styles.TextEditor}>
      <div
        ref={e => this.editable = e!}
        className={styles.editable} style={style}
        onInput={this.handleInput}
        contentEditable={true}
      />
    </div>
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