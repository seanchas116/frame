import { Rect } from 'paintvec'
import { observable, computed, observe, IArraySplice, IArrayChange, IValueDidChange } from 'mobx'
import { Shape, RectShape } from './Shape'
import { Style } from './Style'
import { dataToLayer } from '../format/v1/Deserialize'
import { layerToData } from '../format/v1/Serialize'
import { LayerData } from '../format/v1/Schema'

export class Layer {
  private static maxKey = 0
  readonly key = Layer.maxKey++

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

  get siblings () {
    return this.parent ? this.parent.children : []
  }

  @computed private get data () {
    return layerToData(this)
  }

  constructor () {
    this.children.observe(change => this.handleChildrenChange(change), true)
    observe(this, 'data', change => this.handleDataChange(change), true)
  }

  ancestor (indexPath: number[]): Layer {
    if (indexPath.length === 0) {
      return this
    }
    return this.children[indexPath[0]].ancestor(indexPath.slice(1, -1))
  }

  clone () {
    return dataToLayer(layerToData(this))
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

  private handleDataChange (change: IValueDidChange<LayerData>) {
    console.log(change)
  }
}
