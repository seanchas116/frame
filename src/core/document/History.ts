import * as _ from 'lodash'
import { LayerData } from '../format/v1/Schema'
import { Document } from './Document'
import { UndoStack, UndoCommand } from '../common/UndoStack'
import { dataToLayer, loadDataToLayer } from '../format/v1/Deserialize'

class LayerChange {
  constructor (public path: number[], public oldData: LayerData, public newData: LayerData) {
  }

  apply (document: Document) {
    const layer = document.rootGroup.ancestor(this.path)
    loadDataToLayer(layer, this.newData)
  }

  invert () {
    return new LayerChange(this.path, this.newData, this.oldData)
  }

  merge (latter: LayerChange) {
    if (!_.isEqual(this.path, latter.path)) {
      throw new Error('path is not same')
    }
    return new LayerChange(this.path, this.oldData, latter.newData)
  }
}

class LayerMove {
  constructor (public oldPath: number[], public newPath: number[]) {
  }

  apply (document: Document) {
    const layer = document.rootGroup.ancestor(this.oldPath)
    const newParent = document.rootGroup.ancestor(this.newPath.slice(0, -1))
    newParent.children.splice(_.last(this.newPath)!, 0, layer)
  }

  invert () {
    return new LayerMove(this.oldPath, this.newPath)
  }
}

class LayerInsert {
  constructor (public path: number[], public data: LayerData) {
  }

  apply (document: Document) {
    const layer = dataToLayer(this.data)
    const newParent = document.rootGroup.ancestor(this.path.slice(0, -1))
    newParent.children.splice(_.last(this.path)!, 0, layer)
  }

  invert () {
    return new LayerRemove(this.path, this.data)
  }
}

class LayerRemove {
  constructor (public path: number[], public data: LayerData) {
  }
  apply (document: Document) {
    const parent = document.rootGroup.ancestor(this.path.slice(0, -1))
    parent.children.splice(_.last(this.path)!, 1)
  }

  invert () {
    return new LayerInsert(this.path, this.data)
  }
}

type LayerUpdate = LayerChange | LayerMove | LayerInsert | LayerRemove

class HistoryUndoCommand implements UndoCommand {
  constructor (public title: string, private document: Document, private updates: LayerUpdate[]) {
  }

  undo () {
    for (const update of this.updates) {
      update.invert().apply(this.document)
    }
  }

  redo () {
    for (const update of this.updates) {
      update.apply(this.document)
    }
  }
}

export class HistoryRecorder {
  undoStack = new UndoStack<HistoryUndoCommand>()
  private updates: LayerUpdate[] = []

  constructor (public document: Document) {
  }

  add (update: LayerUpdate) {
    if (update instanceof LayerChange) {
      const last = _.last(this.updates)
      if (last instanceof LayerChange && _.isEqual(update.path, last.path)) {
        const merged = last.merge(update)
        this.updates.pop()
        this.updates.push(merged)
        return
      }
    }
    this.updates.push(update)
  }

  commit (name: string) {
    this.undoStack.push(new HistoryUndoCommand(name, this.document, this.updates))
    this.updates = []
  }
}
