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
}

export type Shape = RectShape | EllipseShape | TextShape
