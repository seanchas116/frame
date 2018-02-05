import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { Document } from '../../core/document/Document'
import { viewZoomToActualSize } from '../ActionIDs'

@registerAction
export class ZoomToActualSizeAction implements Action {
  id = viewZoomToActualSize
  defaultKey = 'Control+0'
  defaultKeyMac = 'Command+0'
  title = 'Actual Size'
  enabled = true

  @action run () {
    Document.current.scroll.scale = 1
  }
}
