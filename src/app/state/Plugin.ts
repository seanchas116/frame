import { IAction } from './Action'

interface IKeyBindings {
  action: string
  key: string
}

export interface IPlugin {
  actions: IAction[]
  keyBindings: IKeyBindings[]
}
