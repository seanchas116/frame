import { Rect } from 'paintvec'
import { observable } from 'mobx'
import { Shape, RectShape } from './Shape'
import { Style } from './Style'
import { IArrayChange, IArraySplice } from 'mobx/lib/types/observablearray';

export class Layer {
  @observable name = 'Layer'
  @observable rect = new Rect()
  @observable shape: Shape = new RectShape()
  @observable style = new Style()

  @observable collapsed = false
  readonly children = observable<Layer>([])

  private _parent: Layer | undefined = undefined
  get parent () { return this._parent }

  constructor () {
    this.children.observe(change => this.handleChildrenChange(change))
  }

  private handleChildrenChange (change: IArrayChange<Layer> | IArraySplice<Layer>) {
    const onChildAdd = (layer: Layer) => {
      layer._parent = this
    }
    const onChildRemove = (layer: Layer) => {
      layer._parent = undefined
    }
    if (change.type === 'update') {
      onChildRemove(change.oldValue)
      onChildAdd(change.newValue)
    } else {
      change.removed.forEach(onChildRemove)
      change.added.forEach(onChildAdd)
    }
  }
}
