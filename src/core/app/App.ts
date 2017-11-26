import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../document/Document'
import { ShapeType } from '../document/Shape'

export class App {
  @observable file = new File(new Document())
  @observable insertMode: ShapeType | undefined = undefined
}

export const app = new App()
