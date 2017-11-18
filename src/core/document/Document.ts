import { GroupLayer } from './Layer'
import { observable } from 'mobx/lib/api/observable'

export class Document {
  @observable rootGroup = new GroupLayer()
}
