import { Extension } from '../../app/state/Extension'
import { UndoAction } from './UndoAction'
import { RedoAction } from './RedoAction'

export default class implements Extension {
  actions = [
    new UndoAction(),
    new RedoAction()
  ]
}
