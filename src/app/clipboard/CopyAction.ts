import * as pasteboard from 'node-pasteboard'
import * as Electron from 'electron'
import { Action, registerAction } from '../../core/action/Action'
import { editCopy } from '../ActionIDs'
import { ClipboardFormat, clipboardMime } from './ClipboardFormat'
import { Document } from '../../core/document/Document'
import { layerToData } from '../../core/format/v1/Serialize'
import { currentFocus } from '../ui/CurrentFocus'

@registerAction
export class CopyAction implements Action {
  id = editCopy
  defaultKey = 'Control+C'
  defaultKeyMac = 'Command+C'
  title = 'Copy'
  enabled = true

  run () {
    if (currentFocus.isTextInput) {
      Electron.remote.getCurrentWebContents().copy()
      return
    }

    const data: ClipboardFormat = Document.current.selection.layers.map(layerToData)
    pasteboard.set({
      data: {
        [clipboardMime]: Buffer.from(JSON.stringify(data))
      }
    })
    // TODO: delete originals
  }
}
