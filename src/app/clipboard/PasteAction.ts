import * as pasteboard from 'node-pasteboard'
import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { editPaste } from '../ActionIDs'
import { ClipboardFormat, clipboardMime } from './ClipboardFormat'
import { dataToLayer } from '../../core/format/v1/Deserialize'
import { Document } from '../../core/document/Document'

@registerAction
export class PasteAction implements Action {
  id = editPaste
  defaultKey = 'Control+V'
  defaultKeyMac = 'Command+V'
  title = 'Paste'
  enabled = true

  @action run () {
    const dataString = pasteboard.getDataString(clipboardMime)
    if (!dataString) {
      return
    }
    const data: ClipboardFormat = JSON.parse(dataString)
    const layers = data.map(data => dataToLayer(Document.current, data))
    // TODO: insert after selected layer
    Document.current.rootGroup.children.push(...layers)
  }
}
