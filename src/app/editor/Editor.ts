import { observable, runInAction } from 'mobx'
import { ShapeType } from '../../core/document/Shape'
import { Scroll } from './Scroll'

export class Editor {
  @observable insertMode: ShapeType | undefined = undefined
  readonly scroll = new Scroll()
}

export const editor = runInAction(() => new Editor())
