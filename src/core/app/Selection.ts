import { computed } from 'mobx'
import { Layer } from '../document/Layer'
import { Document } from '../document/Document'
import { ObservableSet } from '../common/ObservableSet'

export class Selection {
  private readonly set = new ObservableSet<Layer>()

  constructor (public document: Document) {
  }

  @computed private get allLayers () {
    return this.document.rootGroup.descendants
  }

  @computed get layers () {
    const layers: Layer[] = []
    for (const layer of this.allLayers) {
      if (this.set.has(layer)) {
        layers.push(layer)
      }
    }
    this.set.replace(layers)
    return layers
  }

  add (layer: Layer) {
    this.set.add(layer)
  }

  delete (layer: Layer) {
    this.set.delete(layer)
  }
}
