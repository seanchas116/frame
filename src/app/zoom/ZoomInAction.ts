import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'
import { viewZoomIn } from '../ActionIDs'

@registerAction
export class ZoomInAction implements Action {
  id = viewZoomIn
  defaultKey = 'Control+Plus'
  defaultKeyMac = 'Command+Plus'
  title = 'Zoom In'
  enabled = true

  @action run () {
    Document.current.scroll.zoomIn()
  }
}
