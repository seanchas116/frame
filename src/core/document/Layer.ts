import { Rect } from 'paintvec'
import { observable } from 'mobx'
import { Shape, RectShape } from './Shape'
import { Style } from './Style'

export class ShapeLayer {
  @observable name = 'Layer'
  @observable rect = new Rect()
  @observable shape: Shape = new RectShape()
  @observable style = new Style()
}

export class GroupLayer {
  @observable name = 'Layer'
  @observable collapsed = false
  readonly children = observable<Layer>([])
}

export type Layer = ShapeLayer | GroupLayer
