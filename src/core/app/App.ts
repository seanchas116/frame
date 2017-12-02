import { observable, computed } from 'mobx'
import { Vec2, Transform } from 'paintvec'
import { File } from './File'
import { Document } from '../document/Document'
import { ShapeType } from '../document/Shape'

export class App {
  @observable file = new File(new Document())
  @observable insertMode: ShapeType | undefined = undefined

  @observable scroll = new Vec2()

  @computed get transformViewportToDocument () {
    return Transform.translate(this.scroll)
  }
  @computed get transformDocumentToViewport () {
    return Transform.translate(this.scroll.neg())
  }
}

export const app = new App()
