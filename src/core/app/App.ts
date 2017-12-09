import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../document/Document'
import { ShapeType, RectShape } from '../document/Shape'
import { Scroll } from './Scroll'
import { Selection } from './Selection'
import { Layer } from '../document/Layer'
import { Rect } from 'paintvec'

export class App {
  @observable file = new File(new Document())
  @observable insertMode: ShapeType | undefined = undefined
  get document () { return this.file.document }
  get layers () { return this.file.document.rootGroup.children }
  readonly scroll = new Scroll()
  readonly selection = new Selection(this.file.document)

  constructor () {
    // TODO: remove later
    const layer = new Layer()
    layer.shape = new RectShape()
    layer.rect = Rect.fromWidthHeight(10, 20, 30, 40)
    layer.name = 'Layer'
    this.document.rootGroup.children.push(layer)
  }
}

export const app = new App()
