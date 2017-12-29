import { Action } from './Action'

interface KeyBindings {
  action: string
  key: string
}

export interface IPlugin {
  actions: Action[]
  keyBindings: KeyBindings[]
}
