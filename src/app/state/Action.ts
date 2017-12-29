import { ObservableMap } from '../../core/common/ObservableMap'

export interface Action {
  id: string
  title: string
  enabled: boolean
  defaultKey: string | undefined
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
