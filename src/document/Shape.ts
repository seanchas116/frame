import { observable } from 'mobx'

export class RectShape {
  @observable rect = new Rect()
  @observable radius = 0
}

export class EllipseShape {
  @observable rect = new Rect()
}

export class TextShape {
  @observable text = ''
}

export type Shape = RectShape | EllipseShape | TextShape
