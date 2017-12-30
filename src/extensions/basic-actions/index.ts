import { Extension } from '../../app/state/Extension'
import { UndoAction } from './UndoAction'
import { RedoAction } from './RedoAction'

export default class BasicActionsExtension implements Extension {
  actions = [
    new UndoAction(),
    new RedoAction()
  ]
}
