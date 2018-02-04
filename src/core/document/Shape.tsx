import * as React from 'react'
import { observable } from 'mobx'
import { Vec2, Rect } from 'paintvec'

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
  @observable text = ''

  render (rect: Rect) {
    return undefined
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
