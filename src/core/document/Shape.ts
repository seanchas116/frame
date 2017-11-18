import { observable } from 'mobx'
import { Vec2 } from 'paintvec'

export class RectShape {
  @observable radius = 0
}

export class EllipseShape {
}

export class TextShape {
  @observable text = ''
}

export class ImageShape {
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

export type Shape = RectShape | EllipseShape | TextShape
