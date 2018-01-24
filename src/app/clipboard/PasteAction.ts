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
    const document = Document.current
    const data: ClipboardFormat = JSON.parse(dataString)
    const layers = data.map(data => dataToLayer(document, data))
    // TODO: insert after selected layer
    document.rootGroup.children.push(...layers)
    document.selection.replace(layers)
  }
}
