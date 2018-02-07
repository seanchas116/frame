import * as pasteboard from 'node-pasteboard'
import * as Electron from 'electron'
import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { editCut } from '../ActionIDs'
import { ClipboardFormat, clipboardMime } from './ClipboardFormat'
import { Document } from '../../core/document/Document'
import { layerToData } from '../../core/format/v1/Serialize'
import { currentFocus } from '../currentFocus/CurrentFocus'

@registerAction
export class CutAction implements Action {
  id = editCut
  defaultKey = 'Control+X'
  defaultKeyMac = 'Command+X'
  title = 'Cut'
  enabled = true

  @action run () {
    if (currentFocus.isTextInput) {
      Electron.remote.getCurrentWebContents().cut()
      return
    }

    const data: ClipboardFormat = Document.current.selection.layers.map(layerToData)
    pasteboard.set({
      data: {
        [clipboardMime]: Buffer.from(JSON.stringify(data))
      }
    })
    Document.current.deleteLayers()
  }
}
