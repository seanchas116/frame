import { Rect } from 'paintvec'
import { observable, computed, observe, IArraySplice, IArrayChange, IValueDidChange } from 'mobx'
import { Shape, RectShape } from './Shape'
import { Style } from './Style'
import { dataToLayer } from '../format/v1/Deserialize'
import { layerToData } from '../format/v1/Serialize'
import { LayerData } from '../format/v1/Schema'
import { History, LayerChange, LayerInsert, LayerRemove } from './History'
import { Document } from './Document'

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

  get root (): Layer {
    return this.parent ? this.parent.root : this
  }

  private _rootDocument: Document | undefined = undefined

  get document (): Document | undefined {
    return this.root._rootDocument
  }

  get siblings () {
    return this.parent ? this.parent.children : []
  }

  get path (): number[] {
    if (this.parent) {
      return this.parent.path.concat(this.parent.children.indexOf(this))
    } else {
      return []
    }
  }

  @computed get data () { // should be private?
    return layerToData(this)
  }

  constructor () {
    this.children.observe(change => this.handleChildrenChange(change), true)
    observe(this, 'data', change => this.handleDataChange(change), true)
  }

  /* internal */ makeRoot (document: Document) {
    this._rootDocument = document
  }

  descendant (indexPath: number[]): Layer {
    if (indexPath.length === 0) {
      return this
    }
    return this.children[indexPath[0]].descendant(indexPath.slice(1))
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

      const root = this.root
      if (root.document) {
        History.get(root.document)!.stage(layer, new LayerInsert(layer.path, layer.data))
      }
    }
    const onChildRemove = (index: number, layer: Layer) => {
      const parent = layer._parent
      const path = [...parent ? parent.path : [], index]

      layer._parent = undefined

      const root = this.root
      if (root.document) {
        History.get(root.document)!.stage(layer, new LayerRemove(path, layer.data))
      }
    }
    if (change.type === 'update') {
      onChildRemove(change.index, change.oldValue)
      onChildAdd(change.newValue)
    } else {
      change.removed.forEach(layer => onChildRemove(change.index, layer))
      change.added.forEach(onChildAdd)
    }
  }

  private handleDataChange (change: IValueDidChange<LayerData>) {
    const root = this.root
    if (change.oldValue && root.document && this.parent) {
      History.get(root.document)!.stage(this, new LayerChange(this.path, change.oldValue, change.newValue))
    }
  }
}
