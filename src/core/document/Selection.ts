import { computed } from 'mobx'
import { Layer } from './Layer'
import { Document } from './Document'
import { ObservableSet } from '../../lib/ObservableSet'

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
    // this.set.replace(layers)
    return layers
  }

  add (layer: Layer) {
    this.set.add(layer)
  }

  delete (layer: Layer) {
    this.set.delete(layer)
  }

  has (layer: Layer) {
    return this.set.has(layer)
  }

  replace (layers: Iterable<Layer>) {
    this.set.replace(layers)
  }

  clear () {
    this.replace([])
  }
}
