import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { viewZoomOut } from '../ActionIDs'
import { editor } from '../editor/Editor'

@registerAction
export class ZoomOutAction implements Action {
  id = viewZoomOut
  defaultKey = 'Control+-'
  defaultKeyMac = 'Command+-'
  title = 'Zoom Out'
  enabled = true

  @action run () {
    editor.scroll.zoomOut()
  }
}
