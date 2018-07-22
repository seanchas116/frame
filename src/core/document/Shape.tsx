import * as React from 'react'
import { observable } from 'mobx'
import { Vec2, Rect } from 'paintvec'
import { AttributedText } from './AttributedText'

interface IShape {
  readonly type: string
  render (rect: Rect): React.ReactNode | undefined
}

export class RectShape implements IShape {
  readonly type = 'rect'
  @observable radius = 0

  render (rect: Rect) {
    return <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} />
  }
}

export class EllipseShape implements IShape {
  readonly type = 'ellipse'

  render (rect: Rect) {
    const { x: cx, y: cy } = rect.center
    const rx = cx - rect.left
    const ry = cy - rect.top
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
  }
}

export class TextShape implements IShape {
  readonly type = 'text'
  @observable text = new AttributedText([])

  render (rect: Rect) {
    const style: React.CSSProperties = {
      wordWrap: 'break-word',
      cursor: 'default',
      lineHeight: 0
    }
    const children: React.ReactChild[] = []
    for (const line of this.text.lines) {
      for (const span of line.spans) {
        const spanStyle: React.CSSProperties = {
          fontFamily: span.style.family,
          fontSize: span.style.size + 'px',
          lineHeight: span.style.size + 'px',
          fontWeight: span.style.weight as any,
          color: span.style.color.toRGB().toRGBString()
        }
        children.push(<span style={spanStyle}>{span.content}</span>)
      }
      children.push(<br />)
    }
    return <g>
      <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} fill='transparent' stroke='none'/>
      <foreignObject x={rect.left} y={rect.top} width={rect.width} height={rect.height}>
        <div style={style}>{children}</div>
      </foreignObject>
    </g>
  }
}

export class ImageShape implements IShape {
  readonly type = 'image'
  @observable dataURL = ''
  @observable originalSize = new Vec2()

  loadDataURL (dataURL: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.dataURL = dataURL
        this.originalSize = new Vec2(img.width, img.height)
        resolve()
      }
      img.onerror = reject
      img.src = dataURL
    })
  }

  render (rect: Rect) {
    return <image xlinkHref={this.dataURL} x={rect.left} y={rect.top} width={rect.width} height={rect.height} preserveAspectRatio='none' />
  }
}

export class GroupShape {
  readonly type = 'group'

  render (rect: Rect) {
    return undefined
  }
}

export type Shape = RectShape | EllipseShape | TextShape | ImageShape | GroupShape

export type ShapeType = Shape['type']
