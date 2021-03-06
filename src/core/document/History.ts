import * as _ from 'lodash'
import { LayerData } from '../format/v1/Schema'
import { Document } from './Document'
import { UndoStack, UndoCommand } from '../../lib/UndoStack'
import { dataToLayer, loadLayerData } from '../format/v1/Deserialize'
import { Layer } from './Layer'

export class LayerChange {
  constructor (public path: number[], public oldData: LayerData, public newData: LayerData) {
  }

  apply (document: Document) {
    const layer = document.rootGroup.descendant(this.path)
    loadLayerData(layer, this.newData)
  }

  invert () {
    return new LayerChange(this.path, this.newData, this.oldData)
  }
}

export class LayerMove {
  constructor (public oldPath: number[], public newPath: number[]) {
  }

  apply (document: Document) {
    const layer = document.rootGroup.descendant(this.oldPath)
    const oldParent = layer.parent!
    oldParent.children.splice(oldParent.children.indexOf(layer), 1)

    const newParent = document.rootGroup.descendant(this.newPath.slice(0, -1))
    newParent.children.splice(_.last(this.newPath)!, 0, layer)
  }

  invert () {
    return new LayerMove(this.newPath, this.oldPath)
  }
}

export class LayerInsert {
  constructor (public path: number[], public data: LayerData) {
  }

  apply (document: Document) {
    const layer = dataToLayer(this.data)
    const newParent = document.rootGroup.descendant(this.path.slice(0, -1))
    newParent.children.splice(_.last(this.path)!, 0, layer)
  }

  invert () {
    return new LayerRemove(this.path, this.data)
  }
}

export class LayerRemove {
  constructor (public path: number[], public data: LayerData) {
  }
  apply (document: Document) {
    const parent = document.rootGroup.descendant(this.path.slice(0, -1))
    parent.children.splice(_.last(this.path)!, 1)
  }

  invert () {
    return new LayerInsert(this.path, this.data)
  }
}

export type LayerUpdate = LayerChange | LayerMove | LayerInsert | LayerRemove

export class Commit implements UndoCommand {
  constructor (public title: string, private history: History, private updates: LayerUpdate[]) {
    console.log(updates)
  }

  undo () {
    for (const update of this.updates) {
      update.invert().apply(this.history.document)
    }
  }

  redo () {
    for (const update of this.updates) {
      update.apply(this.history.document)
    }
  }
}

function mergeUpdates (update1: LayerUpdate, update2: LayerUpdate) {
  if (update1 instanceof LayerInsert && update2 instanceof LayerChange) {
    return new LayerInsert(update1.path, update2.newData)
  }
  if (update1 instanceof LayerChange && update2 instanceof LayerChange) {
    return new LayerChange(update1.path, update1.oldData, update2.newData)
  }
  if (update1 instanceof LayerRemove && update2 instanceof LayerInsert) {
    return new LayerMove(update1.path, update2.path)
  }
}

export class History {
  // use WeakMap to make History module-private
  private static instances = new WeakMap<Document, History>()
  static get (document: Document) {
    return this.instances.get(document)
  }

  undoStack = new UndoStack<Commit>()
  private updates: [Layer, LayerUpdate][] = []

  constructor (public document: Document) {
    History.instances.set(document, this)
  }

  stage (layer: Layer, update: LayerUpdate) {
    const last = _.last(this.updates)
    if (last && layer === last[0]) {
      const merged = mergeUpdates(last[1], update)
      if (merged) {
        this.updates.pop()
        this.updates.push([layer, merged])
        return
      }
    }
    this.updates.push([layer, update])
  }

  clear () {
    this.updates = []
  }

  commit (name: string) {
    if (this.updates.length !== 0) {
      this.undoStack.push(new Commit(name, this, this.updates.map(u => u[1])))
    }
    this.updates = []
  }
}
