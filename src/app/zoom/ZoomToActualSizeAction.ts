import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { viewZoomToActualSize } from '../ActionIDs'
import { editor } from '../editor/Editor'

@registerAction
export class ZoomToActualSizeAction implements Action {
  id = viewZoomToActualSize
  defaultKey = 'Control+0'
  defaultKeyMac = 'Command+0'
  title = 'Actual Size'
  enabled = true

  @action run () {
    editor.scroll.zoomAroundCenter(1)
  }
}
