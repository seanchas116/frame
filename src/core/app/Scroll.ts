import { observable, computed } from 'mobx'
import { Vec2, Transform } from 'paintvec'

export class Scroll {
  @observable translation = new Vec2()

  @computed get viewportToDocument () {
    return Transform.translate(this.translation.neg())
  }
  @computed get documentToViewport () {
    return Transform.translate(this.translation)
  }
}
