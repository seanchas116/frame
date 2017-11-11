import { observable } from 'mobx'
import { Rect, Vec2 } from 'paintvec'

export class RectShape {
  @observable rect = new Rect()
  @observable radius = 0
}

export class EllipseShape {
  @observable rect = new Rect()
}

export class TextShape {
  @observable rect = new Rect()
  @observable text = ''
}

export class ImageShape {
  @observable rect = new Rect()
  @observable dataURL = ''
  @observable originalSize = new Vec2()
}

export type Shape = RectShape | EllipseShape | TextShape
