import { observable, runInAction } from 'mobx'
import { ShapeType } from '../../core/document/Shape'

export class Editor {
  @observable insertMode: ShapeType | undefined = undefined
}

export const editor = runInAction(() => new Editor())
