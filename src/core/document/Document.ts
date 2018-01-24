import * as _ from 'lodash'
import { observable } from 'mobx'
import { Layer } from './Layer'
import { GroupShape } from './Shape'
import { History } from './History'
import { Scroll } from './Scroll'
import { Selection } from './Selection'

export class Document {
  @observable static current = new Document()

  readonly rootGroup: Layer
  readonly scroll = new Scroll()
  readonly selection = new Selection(this)
  @observable focusedLayer: Layer | undefined = undefined
  private readonly history = new History(this)

  get undoStack () {
    return this.history.undoStack
  }

  constructor () {
    this.rootGroup = this.createLayer()
    this.rootGroup.shape = new GroupShape()
  }

  createLayer () {
    return new Layer(this.history)
  }

  commit (message: string) {
    this.history.commit(message)
  }

  clearHistory () {
    this.history.clear()
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
      const parent = selection.parent
      if (parent) {
        parent.children.splice(parent.children.indexOf(selection), 1)
      }
    }
  }
}
