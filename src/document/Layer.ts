import { observable } from 'mobx'
import { Shape } from './Shape'
import { Style } from './Style'

export class ShapeLayer {
  shape: Shape
  style: Style
  @observable name = 'Layer'
}

export class GroupLayer {
  @observable name = 'Layer'
  @observable collapsed = false
  readonly children = observable<Layer>()
}

export type Layer = ShapeLayer | GroupLayer
