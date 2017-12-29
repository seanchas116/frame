import { Plugin } from '../../app/state/Plugin'
import { UndoAction } from './UndoAction'

export default class BasicActionsPlugin implements Plugin {
  actions = [
    new UndoAction()
  ]
}
