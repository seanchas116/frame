import { observable } from 'mobx'
import { File } from './File'
import { Document } from '../document/Document'
import { ShapeType } from '../document/Shape'
import { ObservableSet } from '../common/ObservableSet'
import { Layer } from '../document/Layer'
import { Scroll } from './Scroll'

export class App {
  @observable file = new File(new Document())
  @observable insertMode: ShapeType | undefined = undefined
  readonly scroll = new Scroll()
  readonly selectedLayers = new ObservableSet<Layer>()
}

export const app = new App()
