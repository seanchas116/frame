import { Rect } from 'paintvec'
import { observable, IArraySplice, IArrayChange } from 'mobx'
import { Shape, RectShape } from './Shape'
import { Style } from './Style'

export class Layer {
  @observable name = 'Layer'
  @observable rect = new Rect()
  @observable shape: Shape = new RectShape()
  @observable style = new Style()

  @observable collapsed = false
  readonly children = observable<Layer>([])

  private _parent: Layer | undefined = undefined
  get parent () { return this._parent }

  get descendants () {
    const descendants: Layer[] = []
    for (const child of this.children) {
      descendants.push(child, ...child.descendants)
    }
    return descendants
  }

  constructor () {
    this.children.observe(change => this.handleChildrenChange(change), true)
  }

  private handleChildrenChange (change: IArrayChange<Layer> | IArraySplice<Layer>) {
    const onChildAdd = (layer: Layer) => {
      if (layer._parent) {
        const index = layer._parent.children.indexOf(layer)
        if (0 <= index) {
          layer._parent.children.splice(index, 1)
        }
      }
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
