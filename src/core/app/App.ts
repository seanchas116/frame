import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../document/Document'
import { ShapeType } from '../document/Shape'
import { Scroll } from './Scroll'
import { Selection } from './Selection'

export class App {
  @observable file = new File(new Document())
  @observable insertMode: ShapeType | undefined = undefined
  get document () { return this.file.document }
  get layers () { return this.file.document.rootGroup.children }
  readonly scroll = new Scroll()
  readonly selection = new Selection(this.file.document)
}

export const app = new App()
