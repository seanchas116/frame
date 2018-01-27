import * as pasteboard from 'node-pasteboard'
import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { editPaste } from '../ActionIDs'
import { ClipboardFormat, clipboardMime } from './ClipboardFormat'
import { dataToLayer } from '../../core/format/v1/Deserialize'
import { Document } from '../../core/document/Document'
import { imageDataToURL } from '../../lib/ImageDataToURL'
import { ImageShape } from '../../core/document/Shape'
import { Vec2, Rect } from 'paintvec'
import { Layer } from '../../core/document/Layer'

@registerAction
export class PasteAction implements Action {
  id = editPaste
  defaultKey = 'Control+V'
  defaultKeyMac = 'Command+V'
  title = 'Paste'
  enabled = true

  @action run () {
    const document = Document.current
    const layers = this.getPasteLayers()
    if (layers.length > 0) {
      document.insertLayers(layers)
      document.selection.replace(layers)
      document.commit('Paste Layers')
    }
  }

  private getPasteLayers (): Layer[] {
    const document = Document.current
    const dataBuffer = pasteboard.getData(clipboardMime)
    if (dataBuffer) {
      const data: ClipboardFormat = JSON.parse(dataBuffer.toString())
      return data.map(data => dataToLayer(document, data))
    }

    const imageData = pasteboard.getImage()
    if (imageData) {
      const imageURL = imageDataToURL(new ImageData(imageData.data, imageData.width, imageData.height))
      const layer = document.createLayer()
      const shape = new ImageShape()
      shape.dataURL = imageURL
      shape.originalSize = new Vec2(imageData.width, imageData.height)
      layer.shape = shape
      layer.rect = Rect.fromWidthHeight(0, 0, imageData.width, imageData.height)
      layer.name = 'Image'
      return [layer]
    }

    return []
  }
}
