import { Plugin } from '../../app/state/Plugin'
import { UndoAction } from './UndoAction'
import { RedoAction } from './RedoAction'

export default class BasicActionsPlugin implements Plugin {
  actions = [
    new UndoAction(),
    new RedoAction()
  ]
}
