import { observable } from 'mobx'
import { Vec2 } from 'paintvec'

export class RectShape {
  readonly type = 'rect'
  @observable radius = 0
}

export class EllipseShape {
  readonly type = 'ellipse'
}

export class TextShape {
  readonly type = 'text'
  @observable text = ''
}

export class ImageShape {
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
}

export class GroupShape {
  readonly type = 'group'
}

export type Shape = RectShape | EllipseShape | TextShape | ImageShape | GroupShape

export type ShapeType = Shape['type']
