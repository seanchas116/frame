import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface PointerEventsProps {
  onPointerDown?: (ev: PointerEvent) => void
  onPointerMove?: (ev: PointerEvent) => void
  onPointerUp?: (ev: PointerEvent) => void
  onPointerDownCapture?: (ev: PointerEvent) => void
  onPointerMoveCapture?: (ev: PointerEvent) => void
  onPointerUpCapture?: (ev: PointerEvent) => void
}

export
class PointerEvents extends React.Component<PointerEventsProps, {}> {
  private element: HTMLElement | undefined

  componentDidMount () {
    this.element = ReactDOM.findDOMNode(this) as HTMLElement
    if (this.element) {
      this.props.onPointerUp && this.element.addEventListener('pointerup', this.props.onPointerUp)
      this.props.onPointerDown && this.element.addEventListener('pointerdown', this.props.onPointerDown)
      this.props.onPointerMove && this.element.addEventListener('pointermove', this.props.onPointerMove)
      this.props.onPointerUpCapture && this.element.addEventListener('pointerup', this.props.onPointerUpCapture, true)
      this.props.onPointerDownCapture && this.element.addEventListener('pointerdown', this.props.onPointerDownCapture, true)
      this.props.onPointerMoveCapture && this.element.addEventListener('pointermove', this.props.onPointerMoveCapture, true)
    }
  }
  componentWillUnmount () {
    if (this.element) {
      this.props.onPointerUp && this.element.removeEventListener('pointerup', this.props.onPointerUp)
      this.props.onPointerDown && this.element.removeEventListener('pointerdown', this.props.onPointerDown)
      this.props.onPointerMove && this.element.removeEventListener('pointermove', this.props.onPointerMove)
      this.props.onPointerUpCapture && this.element.removeEventListener('pointerup', this.props.onPointerUpCapture, true)
      this.props.onPointerDownCapture && this.element.removeEventListener('pointerdown', this.props.onPointerDownCapture, true)
      this.props.onPointerMoveCapture && this.element.removeEventListener('pointermove', this.props.onPointerMoveCapture, true)
    }
  }
  render () {
    return React.Children.only(this.props.children)
  }
}
