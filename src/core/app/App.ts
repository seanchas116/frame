import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../document/Document'

export class App {
  @observable file = new File(new Document())
}
