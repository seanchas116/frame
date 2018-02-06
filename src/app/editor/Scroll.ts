import { observable, computed } from 'mobx'
import { Vec2, Transform } from 'paintvec'
import { EditorView } from './EditorView'

export class Scroll {
  @observable translation = new Vec2()
  @observable scale = 1

  @computed get viewportSize () {
    return EditorView.instance ? EditorView.instance.size : new Vec2(100, 100)
  }
  @computed get viewportToDocument () {
    return Transform.translate(this.translation.neg()).scale(new Vec2(1 / this.scale))
  }
  @computed get documentToViewport () {
    return Transform.scale(new Vec2(this.scale)).translate(this.translation)
  }

  zoomAroundCenter (scale: number) {
    const ratio = scale / this.scale
    this.scale = scale

    const center = this.viewportSize.divScalar(2)
    this.translation = this.translation.sub(center).mulScalar(ratio).add(center).round()
  }

  zoomIn () {
    this.zoomAroundCenter(this.scale * 2)
  }

  zoomOut () {
    this.zoomAroundCenter(this.scale / 2)
  }
}
