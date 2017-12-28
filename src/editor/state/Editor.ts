import { observable } from 'mobx'
import { Document } from '../../core/document/Document'
import { ShapeType } from '../../core/document/Shape'
import { Scroll } from './Scroll'
import { Selection } from './Selection'
import { Layer } from '../../core/document/Layer'

export class Editor {
  @observable document = new Document()
  @observable insertMode: ShapeType | undefined = undefined
  get layers () { return this.document.rootGroup.children }
  readonly scroll = new Scroll()
  readonly selection = new Selection(this.document)
  @observable focusedLayer: Layer | undefined = undefined
}

export const editor = new Editor()
