import { observable } from 'mobx'
import { Document } from '../../core/document/Document'
import { ShapeType, RectShape } from '../../core/document/Shape'
import { Scroll } from './Scroll'
import { Selection } from './Selection'
import { Layer } from '../../core/document/Layer'
import { Rect } from 'paintvec'

export class App {
  @observable document = new Document()
  @observable insertMode: ShapeType | undefined = undefined
  get layers () { return this.document.rootGroup.children }
  readonly scroll = new Scroll()
  readonly selection = new Selection(this.document)

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
