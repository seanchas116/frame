import * as _ from 'lodash'
import { observable } from 'mobx'
import { Layer } from './Layer'
import { GroupShape } from './Shape'
import { History } from './History'
import { Selection } from './Selection'

export class Document {
  @observable static current = new Document()

  readonly rootGroup: Layer
  readonly selection = new Selection(this)
  @observable focusedLayer: Layer | undefined = undefined

  get undoStack () {
    return History.get(this)!.undoStack
  }

  constructor () {
    this.rootGroup = new Layer()
    this.rootGroup.makeRoot(this)
    this.rootGroup.shape = new GroupShape()
    new History(this)
  }

  commit (message: string) {
    History.get(this)!.commit(message)
  }

  clearHistory () {
    History.get(this)!.clear()
  }

  insertLayers (layers: Layer[]) {
    const anchor = _.first(this.selection.layers)
    if (!anchor) {
      this.rootGroup.children.push(...layers)
    } else {
      const parent = anchor.parent!
      const index = parent.children.indexOf(anchor)
      parent.children.splice(index, 0, ...layers)
    }
  }

  deleteLayers () {
    for (const selection of this.selection.layers) {
      const parent = selection.parent!
      parent.children.splice(parent.children.indexOf(selection), 1)
    }
  }
}
