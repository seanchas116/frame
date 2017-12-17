import { Layer } from './Layer'
import { observable } from 'mobx'
import { GroupShape } from './Shape'

export class Document {
  @observable rootGroup = new Layer()

  constructor () {
    this.rootGroup.shape = new GroupShape()
  }
}
