import { observable, runInAction } from 'mobx'
import { Document } from '../document/Document'
import { ShapeType } from '../document/Shape'

export class Editor {
  @observable document = new Document()
  @observable insertMode: ShapeType | undefined = undefined
}

export const editor = runInAction(() => new Editor())
