import { Layer } from './Layer'
import { observable } from 'mobx'
import { GroupShape } from './Shape'
import { History } from './History'

export class Document {
  @observable rootGroup = new Layer()
  private readonly history = new History(this)

  get undoStack () {
    return this.history.undoStack
  }

  constructor () {
    this.rootGroup.shape = new GroupShape()
  }

  commit (message: string) {
    this.history.commit(message)
  }
}
