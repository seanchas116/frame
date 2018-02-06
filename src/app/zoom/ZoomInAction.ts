import { action } from 'mobx'
import { Action, registerAction } from '../../core/action/Action'
import { viewZoomIn } from '../ActionIDs'
import { editor } from '../editor/Editor'

@registerAction
export class ZoomInAction implements Action {
  id = viewZoomIn
  defaultKey = 'Control+Plus'
  defaultKeyMac = 'Command+Plus'
  title = 'Zoom In'
  enabled = true

  @action run () {
    editor.scroll.zoomIn()
  }
}
