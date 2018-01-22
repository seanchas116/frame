import { observable } from 'mobx'
import { Layer } from './Layer'
import { GroupShape } from './Shape'
import { History } from './History'
import { Scroll } from './Scroll'
import { Selection } from './Selection'

export class Document {
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
}
