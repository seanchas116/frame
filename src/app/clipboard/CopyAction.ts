import * as pasteboard from 'node-pasteboard'
import { Action, registerAction } from '../../core/action/Action'
import { editCopy } from '../ActionIDs'
import { ClipboardFormat, clipboardMime } from './ClipboardFormat'
import { Document } from '../../core/document/Document'
import { layerToData } from '../../core/format/v1/Serialize'

@registerAction
export class CopyAction implements Action {
  id = editCopy
  defaultKey = 'Control+C'
  defaultKeyMac = 'Command+C'
  title = 'Copy'
  enabled = true

  run () {
    const data: ClipboardFormat = Document.current.selection.layers.map(layerToData)
    pasteboard.set({
      data: {
        [clipboardMime]: Buffer.from(JSON.stringify(data))
      }
    })
    // TODO: delete originals
  }
}
