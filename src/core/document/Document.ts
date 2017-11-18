import { GroupLayer } from './Layer'
import { observable } from 'mobx'

export class Document {
  @observable rootGroup = new GroupLayer()
}
