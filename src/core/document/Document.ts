import { Layer } from './Layer'
import { observable } from 'mobx'
import { GroupShape } from './Shape'
import { History } from './History'

export class Document {
  @observable rootGroup: Layer
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
}
