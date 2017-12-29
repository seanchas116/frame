import { Layer } from './Layer'
import { GroupShape } from './Shape'
import { History } from './History'

export class Document {
  readonly rootGroup: Layer
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
}
