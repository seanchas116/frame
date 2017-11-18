import { Rect } from 'paintvec'
import { observable } from 'mobx'
import { Shape } from './Shape'
import { Style } from './Style'

export class ShapeLayer {
  @observable name = 'Layer'
  @observable rect = new Rect()
  readonly style = new Style()

  constructor (public readonly shape: Shape) {}
}

export class GroupLayer {
  @observable name = 'Layer'
  @observable collapsed = false
  readonly children = observable<Layer>([])
}

export type Layer = ShapeLayer | GroupLayer
