import { ObservableMap } from '../../lib/ObservableMap'

export interface Action {
  id: string
  title: string
  enabled: boolean
  defaultKey: string | undefined
  defaultKeyMac: string | undefined
  run (): void
}

export class ActionRegistry {
  private actions = new ObservableMap<string, Action>()

  add (action: Action) {
    this.actions.set(action.id, action)
  }

  get (id: string) {
    return this.actions.get(id)
  }
}

export const actionRegistry = new ActionRegistry()

export function registerAction (klass: { new (): Action }) {
  const action = new klass()
  actionRegistry.add(action)
}
