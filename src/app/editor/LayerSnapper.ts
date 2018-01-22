import { Rect } from 'paintvec'
import { Snapper } from './Snapper'
import { Layer } from '../../core/document/Layer'

export class LayerSnapper extends Snapper {
  setTargetLayers (layers: ReadonlyArray<Layer>) {
    this.clear()
    const snapTargets: Rect[] = []
    for (const layer of layers) {
      for (const sibling of layer.siblings) {
        if (!layers.includes(sibling)) {
          snapTargets.push(sibling.rect)
        }
      }
    }
    this.targets = snapTargets
  }
}

export const layerSnapper = new LayerSnapper()
