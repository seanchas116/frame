import { observable, computed } from 'mobx'
import { Vec2, Transform } from 'paintvec'

export class Scroll {
  @observable translation = new Vec2()
  @observable scale = 1

  @computed get viewportToDocument () {
    return Transform.translate(this.translation.neg()).scale(new Vec2(1 / this.scale))
  }
  @computed get documentToViewport () {
    return Transform.scale(new Vec2(this.scale)).translate(this.translation)
  }

  zoomIn () {
    this.scale *= 2
  }
  zoomOut () {
    this.scale /= 2
  }
}
