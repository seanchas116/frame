import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'
import { viewZoomOut } from '../ActionIDs'

@registerAction
export class ZoomOutAction implements Action {
  id = viewZoomOut
  defaultKey = 'Control+-'
  defaultKeyMac = 'Command+-'
  title = 'Zoom Out'
  enabled = true

  @action run () {
    Document.current.scroll.zoomOut()
  }
}
